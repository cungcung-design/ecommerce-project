import os

from celery import Celery


celery_app = Celery(
    "novatrend",
    broker=os.environ.get("CELERY_BROKER_URL", "redis://redis:6379/1"),
    backend=os.environ.get("CELERY_RESULT_BACKEND", "redis://redis:6379/2"),
)

celery_app.conf.update(
    task_ignore_result=False,
    broker_connection_retry_on_startup=True,
)
