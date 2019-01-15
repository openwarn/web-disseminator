FROM python:3.7.2-alpine
COPY ./src/python /code
WORKDIR /code
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
