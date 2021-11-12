import { Row, Col, Button, Image } from "react-bootstrap";



function ProductPage (props){
    let imgName = props.prod.id+".jpg";
    

    return(<>
        <Row>
            <Col>
            <Image src= {process.env.PUBLIC_URL +'products/'+ imgName}></Image>
            </Col>
            <Col>
                <Row>
                    
                </Row>
                <Row>
                    <h4>Category: {props.prod.category}</h4>
                </Row>
                <Row>
                    <h4>Price: {props.prod.price}</h4>
                </Row>
                <Row>
                    <h4>Scadenza: {props.prod.expiryDate}</h4>
                </Row>
                <Row>
                    <h4>Venditore: {props.prod.productProviderName}</h4>
                </Row>
                    
                    
                
            </Col>
        </Row>
        <Row>
            <div>
            <h4>DESCRIPTION</h4>
            </div>
            <div>{props.prod.description}</div>
        </Row>
        <Row>
            <Col></Col>
            {(props.prod.quantity > 0 ) ? <Col>BUY 1 ITEM: <Button>+</Button></Col> : <Col>Product not avaiable</Col>}
        </Row>
    </>);
}

export default ProductPage;