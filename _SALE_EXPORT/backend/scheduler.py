# backend/scheduler.py
"""
Simple Strategy Scheduler (Marketplace Edition)

Script que ejecuta las "Personas" del Marketplace en loop constante.
NO requiere Docker ni cron, solo:
    python scheduler.py
"""

import sys
import os
import time
import json
import logging
from datetime import datetime, timedelta
from pathlib import Path
import uuid
from sqlalchemy.orm import Session


# Setup path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

from database import SessionLocal
from strategies.registry import get_registry
from core.signal_logger import log_signal
from core.signal_evaluator import evaluate_pending_signals
from models_db import StrategyConfig

# Configuración de Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [SCHEDULER] - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

def get_active_strategies_from_db():
    """
    Recupera las estrategias activas directamente de PostgreSQL (StrategyConfig).
    Retorna una lista de diccionarios compatibles con el formato esperado por el scheduler.
    """
    db = SessionLocal()
    try:
        active_configs = db.query(StrategyConfig).filter(StrategyConfig.enabled == 1).all()
        strategies = []
        for c in active_configs:
            # Parse JSON fields safely
            try:
                tokens_list = json.loads(c.tokens) if c.tokens else []
            except:
                tokens_list = []
                
            try:
                tf_list = json.loads(c.timeframes) if c.timeframes else []
            except:
                tf_list = []
                
            # Flatten to single token/tf for now (Scheduler logic might need loop if multiple)
            # Assuming 1 strategy config = 1 persona with 1 main symbol/tf usually, 
            # but DB supports lists. 
            
            # For this MVP Scheduler, we treat each token in the list as a target?
            # Or just take the first one?
            # StrategyConfig usually mirrors the Persona JSON which had single symbol/tf.
            # But the new schema supports lists.
            # Let's support the first one for now or iterate.
            
            target_symbol = tokens_list[0] if tokens_list else "BTC"
            target_tf = tf_list[0] if tf_list else "1h"
            
            strategies.append({
                "id": c.persona_id, # "trend_king_sol"
                "strategy_id": c.strategy_id, # "donchian_v2"
                "symbol": target_symbol,
                "timeframe": target_tf,
                "name": c.name
            })
            
        return strategies
    except Exception as e:
        logger.error(f"Error fetching strategies from DB: {e}")
        return []
    finally:
        db.close()

class StrategyScheduler:
    """
    Scheduler de Estrategias (Modo Marketplace).
    
    Ejecuta las 'Personas' definidas en marketplace_config.py
    """
    
    def __init__(self, loop_interval: int = 60):
        self.loop_interval = loop_interval
        self.registry = get_registry()
        
        print("="*60)
        print("= TraderCopilot - Marketplace Scheduler (DB Powered)")
        print("="*60)
        
        # Registrar estrategias built-in
        print("\n [INFO] Registering strategies...")
        from strategies.example_rsi_macd import RSIMACDDivergenceStrategy
        from strategies.ma_cross import MACrossStrategy
        from strategies.DonchianBreakoutV2 import DonchianBreakoutV2 as DonchianStrategy
        from strategies.bb_mean_reversion import BBMeanReversionStrategy
        from strategies.rsi_divergence import RSIDivergenceStrategy
        from strategies.TrendFollowingNative import TrendFollowingNative
        from strategies.DonchianBreakoutV2 import DonchianBreakoutV2
        
        self.registry.register(RSIMACDDivergenceStrategy)
        self.registry.register(MACrossStrategy)
        self.registry.register(DonchianStrategy)
        self.registry.register(BBMeanReversionStrategy)
        self.registry.register(RSIDivergenceStrategy)
        self.registry.register(TrendFollowingNative)
        self.registry.register(DonchianBreakoutV2)
        print(" [INFO] Strategies registered")
        
        # State tracking for intervals
        self.last_run = {} # {persona_id: timestamp}
        self.processed_signals = {} # {signal_key: timestamp}
        self.last_signal_direction = {} # {persona_id_token: direction} (For alternation enforcement)

        # Lock Config
        self.lock_id = str(uuid.uuid4())
        self.lock_ttl = 30 # seconds
        self.lock_name = "global_scheduler_lock"

    def acquire_lock(self, db: Session) -> bool:
        """Intenta adquirir o renovar el lock de base de datos."""
        from models_db import SchedulerLock
        
        now = datetime.utcnow()
        lock = db.query(SchedulerLock).filter(SchedulerLock.lock_name == self.lock_name).first()
        
        if not lock:
            # Create fresh lock
            try:
                lock = SchedulerLock(
                    lock_name=self.lock_name,
                    owner_id=self.lock_id,
                    expires_at=now + timedelta(seconds=self.lock_ttl)
                )
                db.add(lock)
                db.commit()
                print(f"🔒 Lock acquired (new): {self.lock_id}")
                return True
            except:
                db.rollback()
                return False
        
        # Check if expired or mine
        if lock.expires_at < now or lock.owner_id == self.lock_id:
            lock.owner_id = self.lock_id
            lock.expires_at = now + timedelta(seconds=self.lock_ttl)
            db.commit()
            return True
            
        print(f"🔒 Lock held by other instance ({lock.owner_id}). Retrying...")
        return False
    
    def run(self):
        """Loop principal."""
        iteration = 0
        try:
            while True:
                # 0. Gestion de Lock
                # Cada iteración intentamos renovar. Si perdemos el lock, esperamos.
                db = SessionLocal()
                try:
                    # Ensure table exists? Assume migration did it.
                    # On SQLite simple check helps avoid initial crash if table missing
                    # but main.py should have created it.
                    if not self.acquire_lock(db):
                        print("⏳ Waiting for lock...")
                        time.sleep(10)
                        continue
                except Exception as e:
                    print(f"⚠️ Lock Error: {e}")
                    time.sleep(5)
                    continue
                finally:
                    db.close()

                iteration += 1
                # User requests Buenos Aires Time (UTC-3) for logs
                now = datetime.utcnow()
                ba_time = now - timedelta(hours=3)
                print(f"\n[{ba_time.strftime('%H:%M:%S')}] Iteration #{iteration}")
                
                # 1. Obtener Personas Activas (DB)
                personas = get_active_strategies_from_db()
                print(f"  ℹ️  Active Personas: {len(personas)}")
                
                # 2. Ejecutar cada Persona
                for persona in personas:
                    p_id = persona["id"]
                    
                    # Rate Limit simple (ej: cada 5 mins para todos, o custom)
                    # Por ahora, usamos interval global de loop (60s)
                    # Si quisiéramos per-strategy intervals, checkeamos self.last_run[p_id]
                    
                    print(f"  🔄 Running Persona: {persona['name']} ({persona['symbol']}/{persona['timeframe']})")
                    
                    # Instanciar estrategia técnica
                    strategy_id = persona["strategy_id"]
                    strategy = self.registry.get(strategy_id)
                    
                    if not strategy:
                        print(f"  ⚠️  Strategy class '{strategy_id}' not found!")
                        continue
                        
                    try:
                        # Ejecutar
                        signals = strategy.generate_signals(
                            tokens=[persona["symbol"]],
                            timeframe=persona["timeframe"]
                        )
                        
                        count = 0
                        for sig in signals:
                            # Deduplication Logic 3.0: Timestamp AND Alternation
                            # 1. Prevent reprocessing old signals (History spam)
                            ts_key = f"{p_id}_{sig.token}"
                            last_ts = self.processed_signals.get(ts_key)
                            
                            # Freshness Check: Ignore signals older than 6 hour
                            # This prevents 'backfilling' history into the Live Feed when detailed backtest strategies are run.
                            time_diff = now - sig.timestamp
                            if time_diff > timedelta(hours=6):
                                # print(f"    ⏳ Skipping old signal: {sig.timestamp} (> 6h)")
                                continue

                            if last_ts and sig.timestamp <= last_ts:
                                continue

                            # 2. Prevent same-side spam (Visual Clarity)
                            last_dir = self.last_signal_direction.get(ts_key)
                            if last_dir == sig.direction:
                                continue
                            
                            # 3. Valid New Signal
                            self.processed_signals[ts_key] = sig.timestamp
                            self.last_signal_direction[ts_key] = sig.direction
                            
                            # Enriquecer source con el ID de la persona
                            # Fix user confusion: Use the Human Readable Name? No, Marketplace:{ID} is safer for filtering.
                            sig.source = f"Marketplace:{p_id}"
                            
                            # CRITICAL FIX: Overwrite strategy_id with persona_id so signals are attributed 
                            # to the specific instance (1234), not the generic logic (ma_cross_v1).
                            # This allows separate history and purging for distinct personas using same logic.
                            sig.strategy_id = p_id
                            
                            log_signal(sig)
                            count += 1
                            print(f"    ⭐ SIGNAL: {sig.direction} @ {sig.entry}")
                            
                        if count == 0:
                            print("    (No new signals)")
                            
                        self.last_run[p_id] = now
                        
                    except Exception as e:
                        print(f"  ❌ Error executing {persona['name']}: {e}")
                
                # 3. Evaluador PnL (Critico para mostrar profit real)
                # print("  ⚖️  Evaluating Pending Signals...") # Less verbose
                try:
                    eval_db = SessionLocal()
                    try:
                        # Ensure we use a fresh session to avoid transaction issues
                        new_evals = evaluate_pending_signals(eval_db)
                        if new_evals > 0:
                            print(f"  ✅ Evaluated {new_evals} signals")
                    finally:
                        eval_db.close()
                        
                except Exception as e:
                    print(f"  ❌ Eval Error: {e}")

                print(f"  😴 Sleeping {self.loop_interval}s...")
                time.sleep(self.loop_interval)
                
        except KeyboardInterrupt:
            print("\n🛑 Stopped.")

# Expose instance for imports
scheduler_instance = StrategyScheduler(loop_interval=60)

if __name__ == "__main__":
    scheduler_instance.run()
