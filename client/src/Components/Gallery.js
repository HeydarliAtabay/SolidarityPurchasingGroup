import {Link} from 'react-router-dom'
import {Row, Col, Button, Form, Modal} from 'react-bootstrap'
import {useState} from 'react'
import ProductPage from './ProductPage'


function filterProducts(cat, products){
    if(cat==="")
        return products 
    else
        return products.filter( prod => (prod.category  === cat) )
}

function searchProducts(name, products){
        return products.filter( prod => (prod.name  === name) )
}

function ProductGallery(props){

    let allProducts = props.products
    const [productsToDisplay, setProductsToDisplay] = useState(props.products);
    const [filter, setFilter] = useState("");
    const [prodName, setProdName] = useState("");

    /* hooks for the modal display mode */
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [prodModal, setProdModal] = useState(props.products[0]);
    


    const handleSubmit = (event) =>{
        event.preventDefault();
        setProductsToDisplay(searchProducts(prodName, props.products));
    }

    return(
       
        <>
           

         <Row>
             
             <Col><Button onClick = {() => setProductsToDisplay(filterProducts("", props.products))}> All Products</Button></Col>
            <Col><Button onClick = {() => setProductsToDisplay(filterProducts("Vegetables", props.products))}> Vegetables</Button></Col>
            <Col><Button onClick = {() => setProductsToDisplay(filterProducts("Fruits", props.products))}>Fruits</Button></Col>
            <Col><Button onClick = {() => setProductsToDisplay(filterProducts("Butchery", props.products))}>Butchery</Button></Col>
            <Col><Button onClick = {() => setProductsToDisplay(filterProducts("Bread", props.products))}>Bread</Button></Col>
            <Col><Button onClick = {() => setProductsToDisplay(filterProducts("Drinks", props.products))}>Drinks</Button></Col>
            <Col><Button onClick = {() => setProductsToDisplay(filterProducts("Other", props.products))}>  Other</Button></Col>
            <Col>
            <Form>
                <Row className="align-items-center">
                    <Col xs="auto">
                         <Form.Label htmlFor="inlineFormInput" visuallyHidden>
                            Product Name
                        </Form.Label>
                        <Form.Control
                            className="mb-2"
                            id="inlineFormInput"
                            placeholder="product name"
                            value={prodName} onChange={ev => setProdName(ev.target.value)}
                        />
                    </Col>
                    <Col xs="auto">
                        <Button type="submit" className="mb-2" onClick = {handleSubmit} >
                            Find Product
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Col>
    </Row>
        <Row></Row>
        <Row>
        <div style ={{textAlign: "center"}}>
            <li className ="flex-container">
                    {productsToDisplay.map( p => {
                            return ( <DisplayProduct prod={p} setShow={setShow} setProdModal={setProdModal}/>);
                    })}
            </li>
        </div>
        </Row>
        


        <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{prodModal.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            
            <ProductPage prod = {prodModal}></ProductPage>
        </Modal.Body>
        
      </Modal>

        </>
        

    )
}

function DisplayProduct(props){

    const styleObj = {
        width: 300,
        height: 300,
    };
    let imgName = props.prod.id + ".jpg";
    let link ="/products"+props.prod.id;
    const handleShow = () => {props.setShow(true);
            props.setProdModal(props.prod);    
    }
    return(
    
    
        <div onClick={handleShow}>
            <h1>{props.prod.name}</h1>
        <img className = "image"
            style = {styleObj}
            key = {props.prodImg}
            src = {process.env.PUBLIC_URL +'products/'+ imgName}
            alt = {props.prodImg}
        >
        </img>
        </div>)

}

export default ProductGallery




