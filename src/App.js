import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import chunk from 'lodash.chunk';
import Figure from 'react-bootstrap/Figure';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { retrieveChampions } from './ducks/championsSlice';
import { setNameCriteria } from './ducks/filteringSlice';
import { ROOT_LOL_API } from './consts';

function App() {
  const dispatch = useDispatch();
  const {
    isLoading,
    isError,
    items: champions,
  } = useSelector(state => state.champions);
  const nameCriteria = useSelector(state => state.filtering.nameCriteria);
  const [selectedChampionId, setSelectedChampionId] = React.useState(null);

  React.useEffect(() => {
    dispatch(retrieveChampions());
  }, [dispatch]);

  if (isLoading) {
    return <p>Perai, man, tá carregando...</p>
  }

  if (isError) {
    return <p>Eita, deu ruim.</p>
  }

  const filteredChampions = champions.filter(c => c.name.toLowerCase().includes(nameCriteria.toLowerCase()));
  const championsRows = chunk(filteredChampions, 3);

  return (
    <div>
      <Container as="header">
        <h1>Escolha seu campeão...</h1>
      </Container>
      <Container>
        <ChampionFilteringForm />
      </Container>
      <Container>
        {championsRows.map((champions, index) => (
          <Row key={index}>
            {champions.map(champion => (
              <Col key={champion.id} onClick={() => setSelectedChampionId(champion.id)}>
                <Figure>
                  <Figure.Image
                    width={champion.image.w}
                    height={champion.image.h}
                    alt={`Foto de ${champion.name}`}
                    src={`${ROOT_LOL_API}img/champion/${champion.image.full}`}
                  />
                  <Figure.Caption>
                    {champion.name}
                  </Figure.Caption>
                </Figure>
              </Col>
            ))}
          </Row>
        ))}
      </Container>
      {selectedChampionId && (
        <ChampionDetailsDialog
          championId={selectedChampionId}
          onClose={() => setSelectedChampionId(null)}
        />
      )}
    </div>
  );
}

const ChampionFilteringForm = () => {
  const dispatch = useDispatch();

  const handleNameChange = (event) => {
    dispatch(setNameCriteria(event.target.value));
  };

  return (
    <Form>
      <Form.Group controlId="nameCriteria">
        <Form.Label>Filtro por nome:</Form.Label>
        <Form.Control onChange={handleNameChange} />
      </Form.Group>
    </Form>
  );
};

const ChampionDetailsDialog = ({ championId, onClose }) => {
  const champion = useSelector(state => state.champions.items.find(c => c.id === championId));

  return (
    <Modal onHide={onClose} show>
      <Modal.Header closeButton>
      <Modal.Title>{champion.name}, <small>{champion.title}</small></Modal.Title>
      </Modal.Header>
      <Modal.Body>{champion.blurb}</Modal.Body>
    </Modal>
  );
};

export default App;
