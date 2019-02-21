# WebDisseminator

WebDisseminator is a component of OpenWarn. Clients may connect to a WebDisseminator instance to receive warnings via websocket connection.

## About OpenWarn

OpenWarn is a prototypic open-source warning system which leverages modern microservice architecture concepts
to build an modular and customizable integrated warning system.

It was created as part of the master thesis called
`Konzeption einer Softwarearchitektur für ein Nachrichtensystem zur Warnung der Bevölkerung in Gefahrensituationen` (conception of a software architecture for public warning message systems) at Technical University Ilmenau in 2019.

## Installation

Prerequisites: [Node.js](https://nodejs.org/en/) (>=10), npm version 3+.

```bash
npm install
```

### Build Docker Image

```bash
docker build -t web-disseminator .
```

## Run

```bash
docker run -p 9305:9301 --env KAFKA_HOST="localhost:9092" web-disseminator
```

## Configuration

This service is configurable via environment variables (docker).

* KAFKA_HOST: IP Address / Host of the message broker (kafka instance)

## Contributing

Feel free to contribute to OpenWarn by creating a pull request or adding an issue.

If you are interessted in supporting this project or building a warning system based on this software, contact me via GitHub.

## License

  [MIT](LICENSE)