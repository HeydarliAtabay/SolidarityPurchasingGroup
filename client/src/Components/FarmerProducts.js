import { Button, Modal, Dropdown, Row, Col, Form, FloatingLabel } from 'react-bootstrap';
import API from '../API';
const { useState, useEffect } = require("react");



function FarmerProducts(props) {

    /*products arrays*/
    const [expectedProducts, setExpectedProducts] = useState([]);
    const [providerProducts, setProviderProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    /*modal show states*/
    const [showNewProductModal, setShowNewProductModal] = useState(false);
    const [modifyProductID, setModifyProductID] = useState(-1);
    const [removeProductID, setRemoveProductID] = useState(-1);

    /*useEffect triggers*/
    const [saveAvailability, setSaveAvailability] = useState(false);

    /*USEFFECTS*/
    //Get provider products
    useEffect(() => {
        const getExistingProducts = async () => {
            const prods = await API.getProviderProducts(1);
            setProviderProducts(prods);
        }
        getExistingProducts();
    }, []);

    //Get product categories
    useEffect(() => {
        const getCategories = async () => {
            const cats = await API.getAllCategories();
            setCategories(cats);
        };
        getCategories();
    }, []);

    //Save availability
    useEffect(() => {
        if (!saveAvailability) {
            return;
        }
        const saveProductAvailability = async () => {
            const productData = [];
            expectedProducts.forEach((prod) => (productData.push({
                id: prod.id,
                name: prod.name,
                description: prod.description,
                category: prod.category,
                price: prod.price,
                unit: prod.unit,
                quantity: prod.quantity,
                year: 2021,
                week_number: 2
            })));

            setSaveAvailability(false);
            const productIDs = await API.declareAvailability(productData);

            console.log(productIDs);

            for (let i = 0; i < productIDs.length; i++) {
                const formData = new FormData();
                formData.append('product_image', expectedProducts[i].image);
                await API.uploadProductImage(formData, productIDs[i].new_id);
            }

            console.log("Insertion done");

        }
        saveProductAvailability();
    }, [saveAvailability]);

    /*handle CLOSE of new product modal*/
    const handleNewProductModalClose = () => {
        setShowNewProductModal(false);
    }

    /*handle CLOSE of modify product modal*/
    const handleModifyProductModalClose = () => {
        setModifyProductID(-1);
    }

    /*handle CLOSE of remove product modal*/
    const handleRemoveProductModalClose = () => {
        setRemoveProductID(-1);
    }

    return (
        <>
            <div className="container-fluid mx-3">
                <span className="d-block text-center mt-5 mb-2 display-2">
                    Expected Production
                </span>
                <h5 className="d-block mx-auto mb-5 text-center text-muted">
                    Insert below the expected products for next week
                </h5>
                <div className="d-block">
                    {/*DISPLAYING NOTIFICATION IF NO PRODUCTS INSERTED YET*/
                        expectedProducts.length === 0 ?
                            <div className="d-block text-center">
                                No products inserted yet.
                            </div>
                            :
                            ''
                    }
                    {/*DISPLAYING CURRENTLY INSERTED PRODUCTS*/
                        expectedProducts.map((product) => {
                            return (
                                <div key={product.name} className="card mb-3">
                                    <div className="row g-0">
                                        <div className="col-md-3">
                                            <img className="rounded w-100" src={URL.createObjectURL(product.image)} alt="" />
                                        </div>
                                        <div className="col-md-9">
                                            <div className="card-body">
                                                <h5 className="card-title">{product.name}</h5>
                                                <p className="card-text">{product.description ? product.description : 'No product description'} </p>
                                                <div className="row my-2">
                                                    <div className="col-md">
                                                        {categoryIcon} <b>{categories.find((c) => (c.id === product.category)).name}</b>
                                                    </div>
                                                    <div className="col-md">
                                                        {priceIcon}{' '}
                                                        <b>
                                                            {product.price} €/{product.unit}
                                                        </b>
                                                    </div>
                                                    <div className="col-md">
                                                        {stockIcon}{' '}
                                                        <b>
                                                            {product.quantity} {product.unit} expected
                                                        </b>
                                                    </div>
                                                </div>
                                                <div className="d-block mt-5 text-end">
                                                    <button className="d-inline btn btn-primary mx-3" onClick={() => (setModifyProductID(product.id))}>Modify details</button>
                                                    <button className="d-inlnee btn btn-secondary mr-3" onClick={() => (setRemoveProductID(product.id))}>Remove product</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <hr />
                <div className="d-block text-end">
                    <button className="mx-1 p-2 btn btn-primary" onClick={() => (setShowNewProductModal(true))}>Insert new product</button>
                    <button className="mx-2 p-2 btn btn-success" disabled={expectedProducts.length === 0} onClick={() => (setSaveAvailability(true))}>Confirm expected availability</button>
                </div>
            </div>

            {/*INSERT NEW PRODUCT MODAL*/}
            <Modal show={showNewProductModal} onHide={handleNewProductModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Insert new product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NewProductModalBody providerProducts={providerProducts} expectedProducts={expectedProducts} categories={categories} setExpectedProducts={setExpectedProducts} handleNewProductModalClose={handleNewProductModalClose} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleNewProductModalClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {/*EDIT PRODUCT MODAL*/}
            <Modal show={modifyProductID !== -1} onHide={handleModifyProductModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModifyProductModalBody productID={modifyProductID} expectedProducts={expectedProducts} categories={categories} setExpectedProducts={setExpectedProducts} handleModifyProductModalClose={handleModifyProductModalClose} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModifyProductModalClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            {/*REMOVE PRODUCT MODAL*/}
            <Modal show={removeProductID !== -1} onHide={handleRemoveProductModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to remove this product?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleRemoveProductModalClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => {
                        setExpectedProducts((products) => {
                            const newProds = [];
                            products.forEach(prod => {
                                if (prod.id !== removeProductID) {
                                    newProds.push(prod);
                                }
                            });
                            return newProds;
                        });
                        handleRemoveProductModalClose();
                    }}>
                        Yes, remove product
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function NewProductModalBody(props) {

    /*new product modal states*/
    const [chooseInsertType, setChooseInsertType] = useState(true);
    const [templateInsertType, setTemplateInsertType] = useState(false);
    const [newInsertType, setNewInsertType] = useState(false);
    const [templateInsertForm, setTemplateInsertForm] = useState(false);
    const [newInsertForm, setNewInsertForm] = useState(false);

    /*new product data*/
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [categoryID, setCategoryID] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productUnit, setProductUnit] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productExpiry, setProductExpiry] = useState('');
    const [file, setFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    /*error states*/
    const [templateProductChoiceError, setTemplateProductChoiceError] = useState('');
    const [formNameError, setFormNameError] = useState('');
    const [formPriceError, setFormPriceError] = useState('');
    const [formQuantityError, setFormQuantityError] = useState('');
    const [formCategoryError, setFormCategoryError] = useState('');
    const [formUnitError, setFormUnitError] = useState('');
    const [formImageError, setFormImageError] = useState('');

    const selectFile = (event) => {
        setFile(event.target.files[0]);
        setPreviewImage(URL.createObjectURL(event.target.files[0]));
    }

    function srcToFile(src, fileName, mimeType) {
        return (fetch(src)
            .then((res) => { return res.arrayBuffer(); })
            .then((buf) => { return new File([buf], fileName, { type: mimeType }); })
        );
    }

    /*page switching functions*/
    const switchToTemplateType = () => {
        setChooseInsertType(false);
        setNewInsertType(false);
        setTemplateInsertType(true);
        setTemplateInsertForm(false);
        setNewInsertForm(false);
        setTemplateProductChoiceError('');
    }

    const switchToTemplateForm = () => {
        setChooseInsertType(false);
        setNewInsertType(false);
        setTemplateInsertType(false);
        setTemplateInsertForm(true);
        setNewInsertForm(false);
    }

    const switchToNewInsertForm = () => {
        /*clearing form states*/
        setProductName('');
        setProductDescription('');
        setProductPrice(0);
        setProductUnit('');
        setProductQuantity(0);
        setCategoryID(-1);

        setFormNameError('');
        setFormCategoryError('');
        setFormNameError('');
        setFormQuantityError('');
        setFormUnitError('');


        setChooseInsertType(false);
        setNewInsertType(true);
        setTemplateInsertType(false);
        setTemplateInsertForm(false);
    }

    const goBackToChooseInsertType = () => {
        setChooseInsertType(true);
        setNewInsertType(false);
        setTemplateInsertType(false);
        setTemplateInsertForm(false);
        setNewInsertForm(false);
    }

    const goBackToChooseTemplateType = () => {
        setChooseInsertType(false);
        setNewInsertType(false);
        setTemplateInsertType(true);
        setTemplateInsertForm(false);
        setNewInsertForm(false);
        setTemplateProductChoiceError('');
    }

    const selectTemplateProduct = (product_id) => {
        const prod = props.providerProducts.find((p) => (p.id === product_id));
        if (prod) {
            /*if prod already inserted*/
            if (props.expectedProducts.find((p) => (p.name.toLowerCase() === prod.name.toLowerCase()))) {
                setTemplateProductChoiceError('You have already inserted this product. Choose another one.');
                return;
            }

            srcToFile(process.env.PUBLIC_URL + 'products/' + product_id + '.jpg', 'product_img.jpg', 'image/jpg').then((f) => {
                setFile(f);
                setPreviewImage(URL.createObjectURL(f));
            });

            setProductName(capitalizeEachFirstLetter(prod.name));
            setProductDescription(prod.description);
            setProductPrice(prod.price);
            setProductUnit(prod.unit);
            setProductQuantity(0);
            setCategoryID(prod.category);

            /*setting the correct page to display*/
            switchToTemplateForm();

        } else {
            setTemplateProductChoiceError('The choosen product could not be found. Try again later.');
        }
    }

    /*Utility functions*/
    const capitalizeEachFirstLetter = (str) => {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
    }

    const setProductNameCheck = (name) => {
        setProductName(name.trim());
        if (name.trim() === '') {
            setFormNameError('Product name cannot be empty');
            return;
        }
        setFormNameError('');
    }

    const setProductPriceCheck = (price) => {
        setProductPrice(price);
        if (parseFloat(price) === NaN) {
            setFormPriceError('Product price must be a number');
            return;
        }
        price = parseFloat(price);
        if (price <= 0.0) {
            setFormPriceError('Product price must greater than 0');
            return;
        }
        setFormPriceError('');
    }

    const setProductQuantityCheck = (qty) => {
        setProductQuantity(qty);
        if (parseFloat(qty) === NaN) {
            setFormQuantityError('Product quantity must be a number');
            return;
        }
        qty = parseFloat(qty);
        if (qty <= 0.0) {
            setFormQuantityError('Product quantity must greater than 0');
            return;
        }
        setFormQuantityError('');
    }


    const insertNewProduct = () => {

        let errorFlag = false;
        if (file === null || file === undefined) {
            setFormImageError('Please upload a .jpg product image');
            errorFlag = true;
        }
        if (productName.trim() === '') {
            setFormNameError('Product name cannot be empty');
            errorFlag = true;
        }
        else if (props.expectedProducts.find((p) => (p.name === productName))) {
            setFormNameError('A product with this name already exists! Choose a different name.');
            errorFlag = true;
        }
        if (parseFloat(productPrice) === NaN) {
            setFormPriceError('Product price must be a number');
            errorFlag = true;
        }
        else if (parseFloat(productPrice) <= 0.0) {
            setFormPriceError('Product price must greater than 0');
            errorFlag = true;
        }
        if (parseFloat(productQuantity) === NaN) {
            setFormPriceError('Product price must be a number');
            errorFlag = true;
        }
        else if (parseFloat(productQuantity) <= 0.0) {
            setFormQuantityError('Product quantity must greater than 0');
            errorFlag = true;
        }
        if (!categoryID || categoryID === -1) {
            setFormCategoryError('Please select the product category');
            errorFlag = true;
        }
        if (!productUnit || productUnit === '') {
            setFormUnitError('Please select the product unit');
            errorFlag = true;
        }

        if (errorFlag) {
            return;
        }

        props.setExpectedProducts((products) => {

            let prodID = 1;
            if (products.length > 0) {
                prodID = Math.max(...products.map((p) => (p.id))) + 1;
            }

            const newProduct = {
                image: file,
                id: parseInt(prodID),
                name: productName,
                description: productDescription,
                category: parseInt(categoryID),
                price: parseFloat(productPrice),
                unit: productUnit,
                quantity: parseFloat(productQuantity),
                expiry: ''
            }

            console.log(newProduct);

            products.push(newProduct);
            return products;
        });

        props.handleNewProductModalClose();

    }


    if (chooseInsertType) {
        return (
            <div className="-d-block">
                <div className="d-block text-start">
                    Choose template from a list of products that you have already inserted.<br />
                    <small className="text-secondary">  • No need to retype the product description<br />
                        • No need to re-upload the product image
                    </small>
                    <div className="d-block text-end">
                        <button className="btn btn-primary" onClick={() => (switchToTemplateType())}>Choose</button>
                    </div>
                </div>
                <hr />
                <div className="d-block text-start">
                    Create a new product listing.<br />
                    <small className="text-secondary">  • Need to create everyhting from scratch<br />
                        • Need to upload a new product image
                    </small>
                    <div className="d-block text-end">
                        <button className="btn btn-primary" onClick={() => (switchToNewInsertForm())}>Choose</button>
                    </div>
                </div>
            </div>
        );
    }
    else if (templateInsertType) {
        return (
            <div className="d-block">
                <div className="d-block text-start">
                    <a href="#" className="link-primary" onClick={() => (goBackToChooseInsertType())}>{'< Go Back'}</a>
                </div>
                <div className="d-block text-center">
                    <h4>Choose the product</h4>
                </div>
                <div className="d-block">
                    <div className="list-group overflow-auto height-60vh">
                        {/*LIST OF THE FARMER PRODUCTS*/
                            props.providerProducts.map((product) => (
                                <a key={product.id} href="#" className="list-group-item list-group-item-action" onClick={() => (selectTemplateProduct(product.id))}>
                                    <div className="row">
                                        <div className="col-sm-2">
                                            <img src={process.env.PUBLIC_URL + 'products/' + product.id + '.jpg'} className="img-fluid rounded-start" alt="Product image" />
                                        </div>
                                        <div className="col-sm-10">
                                            <b>{capitalizeEachFirstLetter(product.name)}</b><br />
                                            <small className="text-secondary">{product.description ? product.description : 'No product description'}</small>
                                        </div>
                                    </div>

                                </a>
                            ))
                        }
                    </div>
                </div>
                <div className="d-block text-center mt-3">
                    <small className="text-danger">{templateProductChoiceError}</small>
                </div>
            </div>
        )
    }
    else if (newInsertType) {
        return (
            <div className="d-block ">
                <div className="d-block text-start">
                    <a href="#" className="link-primary" onClick={() => (goBackToChooseInsertType())}>{'< Go Back'}</a>
                </div>
                <div className="d-block text-center">
                    <h4>Fill in the product details</h4>
                </div>
                <Row className="my-2 g-2">
                    <div className="col-md-3">
                        {previewImage ?
                            <img className="rounded-circle w-100" src={previewImage} alt="" />
                            :
                            <div className="text-center rounded-circle">
                                No<br />
                                image
                            </div>
                        }
                    </div>
                    <div className="col-md-9">
                        <Form.Group controlId="formFile" className="mt-3">
                            <Form.Label>Load product image</Form.Label>
                            <Form.Control type="file" name="product_image" accept="image/*" onChange={(event) => (selectFile(event))} />
                        </Form.Group>
                    </div>
                </Row>
                <Row className=" my-2 g-2">
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Product name">
                            <Form.Control type="text" placeholder="Product name" value={productName} onChange={(event) => (setProductNameCheck(event.target.value))} />
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingSelectGrid" label="Product category">
                            <Form.Select aria-label="Product categories" value={categoryID} onChange={(event) => (setCategoryID(event.target.value))}>
                                <option value={-1}>Select product category</option>
                                {props.categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="my-2 g-2">
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Unit price (€)">
                            <Form.Control type="number" placeholder="Product price" value={productPrice} onChange={(event) => (setProductPriceCheck(event.target.value))} />
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingSelectGrid" label="Product unit">
                            <Form.Select aria-label="Product unit" value={productUnit} onChange={(event) => (setProductUnit(event.target.value))}>
                                <option value="">Select unit</option>
                                <option value="kg">Kg</option>
                                <option value="lt">Lt</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Quantity">
                            <Form.Control type="number" placeholder="Quantity" value={productQuantity} onChange={(event) => (setProductQuantityCheck(event.target.value))} />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="my-2 g-2">
                    <Col md>
                        <FloatingLabel controlId="floatingTextarea2" label="Product description">
                            <Form.Control
                                as="textarea"
                                value={productDescription ? productDescription : ''}
                                onChange={(event) => (setProductDescription(event.target.value))}
                                placeholder="Type product description here"
                                style={{ height: '150px' }}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <div className="d-block text-center my-3">
                    <small className="d-block text-danger">{formNameError}</small>
                    <small className="d-block text-danger">{formPriceError}</small>
                    <small className="d-block text-danger">{formQuantityError}</small>
                    <small className="d-block text-danger">{formCategoryError}</small>
                    <small className="d-block text-danger">{formUnitError}</small>
                </div>
                <div className="d-block text-end">
                    <button className="btn btn-primary" onClick={() => (insertNewProduct())}>Insert new product</button>
                </div>
            </div>
        )
    }
    else if (templateInsertForm) {
        return (
            <div className="d-block">
                <div className="d-block text-start">
                    <a href="#" className="link-primary" onClick={() => (goBackToChooseTemplateType())}>{'< Go Back'}</a>
                </div>
                <div className="d-block text-center">
                    <h4>Fill in the product details</h4>
                </div>
                <Row className="my-2 g-2">
                    <div className="col-md-3">
                        {previewImage ?
                            <img className="rounded-circle w-100" src={previewImage} alt="" />
                            :
                            <div className="text-center rounded-circle">
                                No<br />
                                image
                            </div>
                        }
                    </div>
                    <div className="col-md-9">
                        <Form.Group controlId="formFile" className="mt-3">
                            <Form.Label>Replace product image</Form.Label>
                            <Form.Control type="file" name="product_image" accept="image/*" placeholder={productName + ".jpg"} onChange={(event) => (selectFile(event))} />
                        </Form.Group>
                    </div>
                </Row>
                <Row className="my-2 g-2">
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Product name">
                            <Form.Control type="text" placeholder="Product name" value={productName} onChange={(event) => (setProductNameCheck(event.target.value))} />
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingSelectGrid" label="Product category">
                            <Form.Select aria-label="Product categories" value={categoryID} onChange={(event) => (setCategoryID(event.target.value))}>
                                <option value="-1">Select product category</option>
                                {props.categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="my-2 g-2">
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Unit price (€)">
                            <Form.Control type="number" placeholder="Product price" value={productPrice} onChange={(event) => (setProductPriceCheck(event.target.value))} />
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingSelectGrid" label="Product unit">
                            <Form.Select aria-label="Product unit" value={productUnit} onChange={(event) => (setProductUnit(event.target.value))}>
                                <option value="">Select unit</option>
                                <option value="kg">Kg</option>
                                <option value="lt">Lt</option>
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col md>
                        <FloatingLabel controlId="floatingInputGrid" label="Quantity">
                            <Form.Control type="number" placeholder="Quantity" value={productQuantity} onChange={(event) => (setProductQuantityCheck(event.target.value))} />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="my-2 g-2">
                    <Col md>
                        <FloatingLabel controlId="floatingTextarea2" label="Product description">
                            <Form.Control
                                as="textarea"
                                value={productDescription ? productDescription : ''}
                                onChange={(event) => (setProductDescription(event.target.value))}
                                placeholder="Type product description here"
                                style={{ height: '150px' }}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
                <div className="d-block text-center my-3">
                    <small className="d-block text-danger">{formNameError}</small>
                    <small className="d-block text-danger">{formPriceError}</small>
                    <small className="d-block text-danger">{formQuantityError}</small>
                    <small className="d-block text-danger">{formCategoryError}</small>
                    <small className="d-block text-danger">{formUnitError}</small>
                    <small className="d-block text-danger">{formImageError}</small>
                </div>
                <div className="d-block text-end">
                    <button className="btn btn-primary" onClick={() => (insertNewProduct())}>Insert new product</button>
                </div>
            </div>
        )
    }
}

function ModifyProductModalBody(props) {

    /*Utility functions*/
    const capitalizeEachFirstLetter = (str) => {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
    }

    console.log(props.expectedProducts.find(p => p.id === props.productID));

    /*new product data*/
    const [file, setFile] = useState(props.productID !== -1 ? props.expectedProducts.find((p) => (p.id === props.productID)).image : null);
    const [previewImage, setPreviewImage] = useState(props.productID !== -1 ? URL.createObjectURL(props.expectedProducts.find((p) => (p.id === props.productID)).image) : null)
    const [productName, setProductName] = useState(props.productID !== -1 ? capitalizeEachFirstLetter(props.expectedProducts.find((p) => (p.id === props.productID)).name) : '');
    const [productDescription, setProductDescription] = useState(props.productID !== -1 ? props.expectedProducts.find((p) => (p.id === props.productID)).description : '');
    const [categoryID, setCategoryID] = useState(props.productID !== -1 ? props.expectedProducts.find((p) => (p.id === props.productID)).category : '');
    const [productPrice, setProductPrice] = useState(props.productID !== -1 ? props.expectedProducts.find((p) => (p.id === props.productID)).price : '');
    const [productUnit, setProductUnit] = useState(props.productID !== -1 ? props.expectedProducts.find((p) => (p.id === props.productID)).unit : '');
    const [productQuantity, setProductQuantity] = useState(props.productID !== -1 ? props.expectedProducts.find((p) => (p.id === props.productID)).quantity : '');

    /*error states*/
    const [formNameError, setFormNameError] = useState('');
    const [formPriceError, setFormPriceError] = useState('');
    const [formQuantityError, setFormQuantityError] = useState('');
    const [formCategoryError, setFormCategoryError] = useState('');
    const [formUnitError, setFormUnitError] = useState('');
    const [formImageError, setFormImageError] = useState('');

    const selectFile = (event) => {
        setFile(event.target.files[0]);
        setPreviewImage(URL.createObjectURL(event.target.files[0]));
    }

    const setProductNameCheck = (name) => {
        setProductName(name.trim());
        if (name.trim() === '') {
            setFormNameError('Product name cannot be empty');
            return;
        }
        setFormNameError('');
    }

    const setProductPriceCheck = (price) => {
        setProductPrice(price);
        if (parseFloat(price) === NaN) {
            setFormPriceError('Product price must be a number');
            return;
        }
        price = parseFloat(price);
        if (price <= 0.0) {
            setFormPriceError('Product price must greater than 0');
            return;
        }
        setFormPriceError('');
    }

    const setProductQuantityCheck = (qty) => {
        setProductQuantity(qty);
        if (parseFloat(qty) === NaN) {
            setFormQuantityError('Product quantity must be a number');
            return;
        }
        qty = parseFloat(qty);
        if (qty <= 0.0) {
            setFormQuantityError('Product quantity must greater than 0');
            return;
        }
        setFormQuantityError('');
    }


    const modifyProduct = () => {

        let errorFlag = false;
        if (file === null || file === undefined) {
            setFormImageError('Please upload a .jpg product image');
            errorFlag = true;
        }
        if (productName.trim() === '') {
            setFormNameError('Product name cannot be empty');
            errorFlag = true;
        }
        else if (props.expectedProducts.find((p) => (p.name === productName && p.id !== props.productID))) {
            setFormNameError('A product with this name already exists! Choose a different name.');
            errorFlag = true;
        }
        if (parseFloat(productPrice) === NaN) {
            setFormPriceError('Product price must be a number');
            errorFlag = true;
        }
        else if (parseFloat(productPrice) <= 0.0) {
            setFormPriceError('Product price must greater than 0');
            errorFlag = true;
        }
        if (parseFloat(productQuantity) === NaN) {
            setFormPriceError('Product price must be a number');
            errorFlag = true;
        }
        else if (parseFloat(productQuantity) <= 0.0) {
            setFormQuantityError('Product quantity must greater than 0');
            errorFlag = true;
        }
        if (categoryID === -1) {
            setFormCategoryError('Please select the product category');
            errorFlag = true;
        }
        if (productUnit === '') {
            setFormUnitError('Please select the product unit');
            errorFlag = true;
        }

        if (errorFlag) {
            return;
        }

        const modifiedProduct = {
            image: file,
            name: productName,
            description: productDescription,
            category: parseInt(categoryID),
            price: parseFloat(productPrice),
            unit: productUnit,
            quantity: parseFloat(productQuantity),
            expiry: ''
        }

        props.setExpectedProducts((products) => {
            const prodIndex = products.findIndex((p) => (p.id === props.productID));
            products[prodIndex] = modifiedProduct;
            return products;
        });

        props.handleModifyProductModalClose();

    }
    return (
        <div className="d-block">
            <div className="d-block text-center">
                <h4>Modify the necessary product details</h4>
            </div>
            <Row className="my-2 g-2">
                <div className="col-md-3">
                    {previewImage ?
                        <img className="rounded-circle w-100" src={previewImage} alt="" />
                        :
                        <div className="text-center rounded-circle">
                            No<br />
                            image
                        </div>
                    }
                </div>
                <div className="col-md-9">
                    <Form.Group controlId="formFile" className="mt-3">
                        <Form.Label>Replace product image</Form.Label>
                        <Form.Control type="file" name="product_image" accept="image/*" placeholder={productName + ".jpg"} onChange={(event) => (selectFile(event))} />
                    </Form.Group>
                </div>
            </Row>
            <Row className="my-2 g-2">
                <Col md>
                    <FloatingLabel controlId="floatingInputGrid" label="Product name">
                        <Form.Control type="text" placeholder="Product name" value={productName} onChange={(event) => (setProductNameCheck(event.target.value))} />
                    </FloatingLabel>
                </Col>
                <Col md>
                    <FloatingLabel controlId="floatingSelectGrid" label="Product category">
                        <Form.Select aria-label="Product categories" value={categoryID} onChange={(event) => (setCategoryID(event.target.value))}>
                            <option value="-1">Select product category</option>
                            {props.categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>
                </Col>
            </Row>
            <Row className="my-2 g-2">
                <Col md>
                    <FloatingLabel controlId="floatingInputGrid" label="Unit price (€)">
                        <Form.Control type="number" placeholder="Product price" value={productPrice} onChange={(event) => (setProductPriceCheck(event.target.value))} />
                    </FloatingLabel>
                </Col>
                <Col md>
                    <FloatingLabel controlId="floatingSelectGrid" label="Product unit">
                        <Form.Select aria-label="Product unit" value={productUnit} onChange={(event) => (setProductUnit(event.target.value))}>
                            <option value="">Select unit</option>
                            <option value="kg">Kg</option>
                            <option value="lt">Lt</option>
                        </Form.Select>
                    </FloatingLabel>
                </Col>
                <Col md>
                    <FloatingLabel controlId="floatingInputGrid" label="Quantity">
                        <Form.Control type="number" placeholder="Quantity" value={productQuantity} onChange={(event) => (setProductQuantityCheck(event.target.value))} />
                    </FloatingLabel>
                </Col>
            </Row>
            <Row className="my-2 g-2">
                <Col md>
                    <FloatingLabel controlId="floatingTextarea2" label="Product description">
                        <Form.Control
                            as="textarea"
                            value={productDescription ? productDescription : ''}
                            onChange={(event) => (setProductDescription(event.target.value))}
                            placeholder="Type product description here"
                            style={{ height: '150px' }}
                        />
                    </FloatingLabel>
                </Col>
            </Row>
            <div className="d-block text-center my-3">
                <small className="d-block text-danger">{formNameError}</small>
                <small className="d-block text-danger">{formPriceError}</small>
                <small className="d-block text-danger">{formQuantityError}</small>
                <small className="d-block text-danger">{formCategoryError}</small>
                <small className="d-block text-danger">{formUnitError}</small>
                <small className="d-block text-danger">{formImageError}</small>
            </div>
            <div className="d-block text-end">
                <button className="btn btn-primary" onClick={() => (modifyProduct())}>Modify product</button>
            </div>
        </div>
    )
}

const categoryIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="currentColor"
        className="bi bi-bookmark"
        viewBox="0 0 16 16"
    >
        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
    </svg>
);

const priceIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="currentColor"
        className="bi bi-tag"
        viewBox="0 0 16 16"
    >
        <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z" />
        <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z" />
    </svg>
);

const producerIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="currentColor"
        className="bi bi-person-badge"
        viewBox="0 0 16 16"
    >
        <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        <path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492V2.5z" />
    </svg>
);

const producerIconBig = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        fill="currentColor"
        className="bi bi-person-circle"
        viewBox="0 0 16 16"
    >
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        <path
            fillRule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
        />
    </svg>
);

const stockIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="currentColor"
        className="bi bi-boxes"
        viewBox="0 0 16 16"
    >
        <path
            fillRule="evenodd"
            d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434L7.752.066ZM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567L4.25 7.504ZM7.5 9.933l-2.75 1.571v3.134l2.75-1.571V9.933Zm1 3.134 2.75 1.571v-3.134L8.5 9.933v3.134Zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567-2.742 1.567Zm2.242-2.433V3.504L8.5 5.076V8.21l2.75-1.572ZM7.5 8.21V5.076L4.75 3.504v3.134L7.5 8.21ZM5.258 2.643 8 4.21l2.742-1.567L8 1.076 5.258 2.643ZM15 9.933l-2.75 1.571v3.134L15 13.067V9.933ZM3.75 14.638v-3.134L1 9.933v3.134l2.75 1.571Z"
        />
    </svg>
);

const expiryDateIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="currentColor"
        className="bi bi-calendar3"
        viewBox="0 0 16 16"
    >
        <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
        <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    </svg>
);

export default FarmerProducts;