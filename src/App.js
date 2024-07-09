import React, { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Modal, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './App.css';

function App() {
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [imageTopo, setImageTopo] = useState([]);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedModifier, setSelectedModifier] = useState(null);
  const [cart, setCart] = useState([]);

  const handleTopicClick = (topicId) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setSelectedModifier(null);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleModifierChange = (modifier) => {
    setSelectedModifier(modifier);
  };

  const getItemPrice = () => {
    return selectedModifier ? selectedModifier.price : selectedItem.price;
  };

  const handleAddToCart = () => {
    const newItem = {
      ...selectedItem,
      quantity,
      price: getItemPrice(),
      modifier: selectedModifier,
    };
    setCart([...cart, newItem]);
    handleCloseModal();
  };

  const handleCartItemIncrease = (index) => {
    const newCart = [...cart];
    newCart[index].quantity += 1;
    setCart(newCart);
  };

  const handleCartItemDecrease = (index) => {
    const newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
      setCart(newCart);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  useEffect(() => {
    fetch('/challenge/menu')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(json => {
        setData(json.sections);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    fetch('/challenge/venue/9')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(json => {
        setImageTopo(json.webSettings.bannerImage);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="menu">
        <p className="menuItem">Menu</p>
        <p className="menuItem">Entrar</p>
        <p className="menuItem">Contato</p>
      </header>
      
      <img className="imageTopo" src={imageTopo} alt="Topo" />

      <div className="container">
        <div className="searchBar">
          <img src="https://img.icons8.com/ios-filled/50/000000/search.png" alt="Search Icon" className="searchIcon"/>
          <input type="text" placeholder="Search menu item" className="searchInput" />
        </div>

        <div className="storeAndCart">
          <div className="storeItems">
            <div className="horizontalTopics">
              {data.map(topic => (
                <div key={topic.id} className="topicItem" onClick={() => handleTopicClick(topic.id)}>
                  <img src={topic.images[0].image} alt={topic.name} className="topicImage" />
                  <p className="topicName">{topic.name}</p>
                </div>
              ))}
            </div>

            {data.map(topic => (
              <Accordion key={topic.id} expanded={expandedTopic === topic.id} onChange={() => handleTopicClick(topic.id)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${topic.id}-content`}
                  id={`panel-${topic.id}-header`}
                >
                  <Typography>{topic.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="itemList">
                    {topic.items.map(item => (
                      <div key={item.id} className="item" onClick={() => handleItemClick(item)}>
                        <div className="itemDetails">
                          <p className="itemName">{item.name}</p>
                          <p className="itemDescription">{item.description}</p>
                          {item.price > 0 && <p className="itemPrice">$ {item.price}</p>}
                        </div>
                        {item.images && <img src={item.images[0].image} alt={item.name} className="itemImage"/>}
                      </div>
                    ))}
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
          <div className="cart">
            <h2>Carrinho</h2>
            {cart.length === 0 ? (
              <p>Seu carrinho está vazio</p>
            ) : (
              <div>
                <div className="cartItems">
                  {cart.map((item, index) => (
                    <div key={index} className="cartItem">
                      <div className="cartItemDetails">
                        <div className="cartQuantityControl">
                          <p>{item.name} {item.modifier && `(${item.modifier.name})`}</p>
                          <button className='quantityButtonMore' onClick={() => handleCartItemDecrease(index)}>-</button>
                          <span>{item.quantity}</span>
                          <button className='quantityButtonMore' onClick={() => handleCartItemIncrease(index)}>+</button>
                        </div>
                        <p className='valuePrice'>$ {item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cartTotal">
                  <div className='totals'>
                    <p>Subtotal:</p>
                    <p>$ {calculateSubtotal()}</p>
                  </div>
                  <div className='totals'>
                    <p>Total:</p>
                    <p>$ {calculateSubtotal()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedItem && (
        <Modal
          open={Boolean(selectedItem)}
          onClose={handleCloseModal}
        >
          <Box className="modalBox">
            <button className="closeButton" onClick={handleCloseModal}>X</button>
            {selectedItem.images && <img src={selectedItem.images[0].image} alt={selectedItem.name} className="modalImage" />}
            <Typography variant="h5">{selectedItem.name}</Typography>
            <Typography variant="body1">{selectedItem.description}</Typography>
            {selectedItem.modifiers && selectedItem.modifiers.map((modifierGroup, idx) => (
              <div key={idx} className="modifierGroup">
                <Typography variant="h6">{modifierGroup.name}</Typography>
                {modifierGroup.items.map(modifier => (
                  <div key={modifier.id} className="modifierItem" onClick={() => handleModifierChange(modifier)}>
                    <input type="radio" name={`modifier-${modifierGroup.id}`} value={modifier.id} checked={selectedModifier?.id === modifier.id} />
                    <label>{modifier.name} - $ {modifier.price}</label>
                  </div>
                ))}
              </div>
            ))}
            <div className="quantityControl">
              <button className='quantityButtonLater' onClick={handleDecreaseQuantity}>-</button>
              <span>{quantity}</span>
              <button className='quantityButtonMore' onClick={handleIncreaseQuantity}>+</button>
            </div>
            <div className='buttonSubimit'>
              {getItemPrice() > 0 && <button className="addOrderButton" onClick={handleAddToCart}>Add order • $ {getItemPrice() * quantity}</button>}
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
}

export default App;
