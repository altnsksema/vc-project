const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'interaction-service',
  brokers: ['127.0.0.1:9092'] // Bizim emektar Kafka portu
});

const consumer = kafka.consumer({ groupId: 'interaction-group' });

const run = async () => {
  // Python tarafında "story-events" konusuna yazmıştık, orayı dinliyoruz
  await consumer.connect();
  await consumer.subscribe({ topic: 'story-events', fromBeginning: true });

  console.log("🟢 Etkileşim Servisi pusuda, Kafka mesajlarını bekliyor...");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      
      console.log("------------------------------------------");
      console.log("📢 YENİ HİKAYE EKLENDİ!");
      console.log(`📖 Hikaye: ${data.baslik}`);
      console.log(`✍️ Yazar: ${data.yazar}`);
      console.log(`🆔 ID: ${data.hikaye_id}`);
      console.log("✨ Aksiyon: Okuyuculara anlık bildirim gönderiliyor...");
      console.log("------------------------------------------");
      
      // Burası ileride Socket.io ile frontend'e "Hey yeni hikaye geldi!" diyecek yer
    },
  });
};

run().catch(console.error);