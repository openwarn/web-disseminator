import logging

from kafka import KafkaConsumer
 
def createLogger(category):
    logger = logging.getLogger(category)
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        '%(asctime)s [%(name)-12s] %(levelname)-8s %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.DEBUG)
    return logger

if __name__ == '__main__':
    logger = createLogger('main')
    topic = 'birds'
    logger.info('using topic birds')
    consumer = KafkaConsumer(topic, auto_offset_reset='earliest', bootstrap_servers=['kafka:9092'])
    logger.info('subscribe')
    for message in consumer:
        logger.info("Eine Nachricht aus dem Topic " + topic + " ist angekommen")

    if consumer is not None:
        consumer.close()
