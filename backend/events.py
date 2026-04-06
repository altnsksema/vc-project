from confluent_kafka import Producer
import json


producer_config = {'bootstrap.servers': '127.0.0.1:9092'}
kafka_producer = Producer(producer_config)

def publish_new_story_event(hikaye_id: int, yazar: str, baslik: str):
    olay_verisi = {
        "event_type": "yeni_hikaye_yayinda",
        "hikaye_id": hikaye_id,
        "yazar": yazar,
        "baslik": baslik
    }
    
    kafka_producer.produce(
        topic="story-events", 
        value=json.dumps(olay_verisi).encode('utf-8')
    )
    kafka_producer.flush()