import {
  Button,
  Modal,
  Row,
  Col,
  Form,
  FloatingLabel,
  Spinner,
  Alert,
} from 'react-bootstrap';
import API from '../API';
import dayjs from 'dayjs';
const { useState, useEffect } = require('react');

dayjs.Ls.en.weekStart = 1; //set week start as monday

var weekOfYear = require('dayjs/plugin/weekOfYear');
dayjs.extend(weekOfYear);

function FarmerProducts(props) {
  /*products arrays*/
  const [expectedProducts, setExpectedProducts] = useState([]);
  const [providerProducts, setProviderProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  /*modal show states*/
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [modifyProductID, setModifyProductID] = useState(-1);
  const [removeProductID, setRemoveProductID] = useState(-1);

  /*save status alert*/
  const [saveAlert, setSaveAlert] = useState(null);

  /*spinning circle*/
  const [showLoading, setShowLoading] = useState(true);

  /*useEffect triggers*/
  const [saveAvailability, setSaveAvailability] = useState(false);
  const [refreshExpected, setRefreshExpected] = useState(true);

  /*USEFFECTS*/
  //Get expected products that the farmer has already inserted before
  useEffect(() => {
    if (!refreshExpected) {
      return;
    }
    const getExpectedProducts = async () => {
      const nextWeek = getCorrectWeekNumber();

      setShowLoading(true);
      setRefreshExpected(false);

      let prods = await API.getProviderAvailableProducts(
        nextWeek.year,
        nextWeek.week_number
      );
      let expectedProds = [];

      for (const prod of prods) {
        const img = await srcToFile(
          process.env.PUBLIC_URL + 'products/' + prod.id + '.jpg',
          'product_image',
          'image/jpg'
        );
        expectedProds.push({ image: img, ...prod });
      }

      setExpectedProducts(expectedProds);

      const providerProds = await API.getProviderProducts();
      setProviderProducts(providerProds);

      setShowLoading(false);
    };
    getExpectedProducts();
  }, [refreshExpected]);

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
      setShowLoading(true);

      const nextWeek = getCorrectWeekNumber();

      const productData = [];
      expectedProducts.forEach((prod) =>
        productData.push({
          id: prod.id,
          name: prod.name,
          description: prod.description,
          category: prod.category,
          price: prod.price,
          unit: prod.unit,
          quantity: prod.quantity,
          year: getCorrectWeekNumber().year,
          week_number: getCorrectWeekNumber().week_number,
        })
      );

      setSaveAvailability(false);
      const productIDs = await API.declareAvailability(
        productData,
        nextWeek.year,
        nextWeek.week_number
      );

      console.log("hi");

      for (let i = 0; i < productIDs.length; i++) {
        let formData = new FormData();
        formData.append('product_image', expectedProducts[i].image);
        await API.uploadProductImage(formData, productIDs[i].new_id);
      }
      setSaveAlert({
        variant: 'success',
        msg: 'Product availability successfully recorded',
      });
      setRefreshExpected(true);
    };
    saveProductAvailability();
  }, [saveAvailability]);

  /*handle CLOSE of new product modal*/
  const handleNewProductModalClose = () => {
    setShowNewProductModal(false);
  };

  /*handle CLOSE of modify product modal*/
  const handleModifyProductModalClose = () => {
    setModifyProductID(-1);
  };

  /*handle CLOSE of remove product modal*/
  const handleRemoveProductModalClose = () => {
    setRemoveProductID(-1);
  };

  /*utility functions*/
  async function srcToFile(src, fileName, mimeType) {
    const res = await fetch(src);
    const buf = await res.arrayBuffer();
    return new File([buf], fileName, { type: mimeType });
  }

  const getCorrectWeekNumber = () => {
    //Saturday
    if (dayjs(props.time.date).day() === 6) {
      if (dayjs('01/01/2021 ' + props.time.hour).hour() < 9) {
        //Before SAT 9AM -> declaring for this week
        const nextWeekDate = dayjs(props.time.date);
        return {
          year: dayjs(props.time.date).year(),
          week_number: dayjs(props.time.date).week(),
        };
      }
      //After SAT 9AM -> declaring for next week
      else {
        //next week = week + 2
        const nextWeekDate = dayjs(props.time.date).add(1, 'week');
        return {
          year: dayjs(nextWeekDate).year(),
          week_number: dayjs(nextWeekDate).week(),
        };
      }
    }
    //Sunday -> declaring for next week
    else if (dayjs(props.time.date).day() === 0) {
      const nextWeekDate = dayjs(props.time.date).add(1, 'week');
      return {
        year: dayjs(nextWeekDate).year(),
        week_number: dayjs(nextWeekDate).week(),
      };
    }
    //from Monday up to Saturday 9am -> declaring for this week
    else {
      const nextWeekDate = dayjs(props.time.date);
      return {
        year: dayjs(nextWeekDate).year(),
        week_number: dayjs(nextWeekDate).week(),
      };
    }
  };

  return (
    <div className="w-100 text-center">
      <span className="d-block text-center mt-5 mb-2 display-2">
        Expected Production
      </span>
      <h5 className="d-block mx-auto mb-5 text-center text-muted">
        Insert below the expected products for next week
      </h5>

      <div className="container">
        <div className="row">
          <div className="col-lg-2" />
          <div className="col-lg-8">
            {saveAlert && (
              <Alert
                variant={saveAlert.variant}
                dismissible={true}
                onClose={() => setSaveAlert(null)}
              >
                {saveAlert.msg}
              </Alert>
            )}
            {showLoading && (
              <div className="d-block text-center p-5">
                <Spinner className="m-5" animation="grow" />
              </div>
            )}
            {!showLoading && (
              <div className="d-block text-center">
                {
                  /*DISPLAYING NOTIFICATION IF NO PRODUCTS INSERTED YET*/
                  expectedProducts.length === 0 ? (
                    <div className="d-block text-center">
                      No products inserted yet.
                    </div>
                  ) : (
                    ''
                  )
                }
                {
                  /*DISPLAYING CURRENTLY INSERTED PRODUCTS*/
                  expectedProducts.map((product) => {
                    return (
                      <div key={product.id} className="card mb-3 shadow-lg">
                        <div className="row g-0">
                          <div className="col-md-3">
                            <img
                              className="rounded w-100"
                              src={URL.createObjectURL(product.image)}
                              alt=""
                            />
                          </div>
                          <div className="col-md-9">
                            <div className="card-body">
                              <h5 className="card-title">{product.name}</h5>
                              <p className="card-text">
                                {product.description
                                  ? product.description
                                  : 'No product description'}{' '}
                              </p>
                              <div className="row my-2">
                                <div className="col-md mt-2">
                                  {categoryIcon}{' '}
                                  <b>
                                    {
                                      categories.find(
                                        (c) => c.id === product.category
                                      ).name
                                    }
                                  </b>
                                </div>
                                <div className="col-md mt-2">
                                  {priceIcon}{' '}
                                  <b>
                                    {product.price} €/{product.unit}
                                  </b>
                                </div>
                                <div className="col-md mt-2">
                                  {stockIcon}{' '}
                                  <b>
                                    {product.quantity} {product.unit} expected
                                  </b>
                                </div>
                              </div>
                              <div className="d-block mt-4 text-center">
                                <button
                                  className="d-inlnee btn btn-danger mr-3"
                                  onClick={() => setRemoveProductID(product.id)}
                                >
                                  Remove product
                                </button>
                                <button
                                  className="d-inline btn btn-primary mx-3"
                                  onClick={() => setModifyProductID(product.id)}
                                >
                                  Modify details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            )}
          </div>
          <div className="col-lg-2" />
        </div>
      </div>
      <hr />
      <div className="d-block mb-5 text-center">
        <button
          className="mx-1 mt-2 p-3 btn btn-primary"
          onClick={() => setShowNewProductModal(true)}
        >
          Insert new product
        </button>
        <button
          className="mx-2 mt-2 p-3 btn btn-success"
          onClick={(event) => { event.preventDefault(); event.stopPropagation(); setSaveAvailability(true) }}
        >
          Save expected availability
        </button>
      </div>

      {/*INSERT NEW PRODUCT MODAL*/}
      <Modal show={showNewProductModal} onHide={handleNewProductModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Insert new product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewProductModalBody
            providerProducts={providerProducts}
            expectedProducts={expectedProducts}
            categories={categories}
            setExpectedProducts={setExpectedProducts}
            handleNewProductModalClose={handleNewProductModalClose}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleNewProductModalClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/*EDIT PRODUCT MODAL*/}
      <Modal
        show={modifyProductID !== -1}
        onHide={handleModifyProductModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modify product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModifyProductModalBody
            productID={modifyProductID}
            expectedProducts={expectedProducts}
            categories={categories}
            setExpectedProducts={setExpectedProducts}
            handleModifyProductModalClose={handleModifyProductModalClose}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleModifyProductModalClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/*REMOVE PRODUCT MODAL*/}
      <Modal
        show={removeProductID !== -1}
        onHide={handleRemoveProductModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleRemoveProductModalClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setExpectedProducts((products) => {
                const newProds = [];
                products.forEach((prod) => {
                  if (prod.id !== removeProductID) {
                    newProds.push(prod);
                  }
                });
                return newProds;
              });
              handleRemoveProductModalClose();
            }}
          >
            Yes, remove product
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

function NewProductModalBody(props) {
  /*new product modal states*/
  const [chooseInsertType, setChooseInsertType] = useState(true);
  const [templateInsertType, setTemplateInsertType] = useState(false);
  const [newInsertType, setNewInsertType] = useState(false);
  const [templateInsertForm, setTemplateInsertForm] = useState(false);

  /*new product data*/
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [categoryID, setCategoryID] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productUnit, setProductUnit] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  /*error states*/
  const [templateProductChoiceError, setTemplateProductChoiceError] =
    useState('');
  const [formNameError, setFormNameError] = useState('');
  const [formPriceError, setFormPriceError] = useState('');
  const [formQuantityError, setFormQuantityError] = useState('');
  const [formCategoryError, setFormCategoryError] = useState('');
  const [formUnitError, setFormUnitError] = useState('');
  const [formImageError, setFormImageError] = useState('');

  const selectFile = (event) => {
    setFile(event.target.files[0]);
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
  };

  function srcToFile(src, fileName, mimeType) {
    return fetch(src)
      .then((res) => {
        return res.arrayBuffer();
      })
      .then((buf) => {
        return new File([buf], fileName, { type: mimeType });
      });
  }

  /*page switching functions*/
  const switchToTemplateType = () => {
    setChooseInsertType(false);
    setNewInsertType(false);
    setTemplateInsertType(true);
    setTemplateInsertForm(false);
    setTemplateProductChoiceError('');
  };

  const switchToTemplateForm = () => {
    setChooseInsertType(false);
    setNewInsertType(false);
    setTemplateInsertType(false);
    setTemplateInsertForm(true);
  };

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
  };

  const goBackToChooseInsertType = () => {
    setChooseInsertType(true);
    setNewInsertType(false);
    setTemplateInsertType(false);
    setTemplateInsertForm(false);
  };

  const goBackToChooseTemplateType = () => {
    setChooseInsertType(false);
    setNewInsertType(false);
    setTemplateInsertType(true);
    setTemplateInsertForm(false);
    setTemplateProductChoiceError('');
  };

  const selectTemplateProduct = (product_id) => {
    const prod = props.providerProducts.find((p) => p.id === product_id);
    if (prod) {
      /*if prod already inserted*/
      if (
        props.expectedProducts.find(
          (p) => p.name.toLowerCase() === prod.name.toLowerCase()
        )
      ) {
        setTemplateProductChoiceError(
          'You have already inserted this product. Choose another one.'
        );
        return;
      }

      srcToFile(
        process.env.PUBLIC_URL + 'products/' + product_id + '.jpg',
        'product_img.jpg',
        'image/jpg'
      ).then((f) => {
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
      setTemplateProductChoiceError(
        'The choosen product could not be found. Try again later.'
      );
    }
  };

  /*Utility functions*/
  const capitalizeEachFirstLetter = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  };

  const setProductNameCheck = (name) => {
    setProductName(name.trim());
    if (name.trim() === '') {
      setFormNameError('Product name cannot be empty');
      return;
    }
    setFormNameError('');
  };

  const setProductPriceCheck = (price) => {
    setProductPrice(price);
    if (isNaN(parseFloat(price))) {
      setFormPriceError('Product price must be a number');
      return;
    }
    price = parseFloat(price);
    if (price <= 0.0) {
      setFormPriceError('Product price must greater than 0');
      return;
    }
    setFormPriceError('');
  };

  const setProductQuantityCheck = (qty) => {
    setProductQuantity(qty);
    if (isNaN(parseFloat(qty))) {
      setFormQuantityError('Product quantity must be a number');
      return;
    }
    qty = parseFloat(qty);
    if (qty <= 0.0) {
      setFormQuantityError('Product quantity must greater than 0');
      return;
    }
    setFormQuantityError('');
  };

  const insertNewProduct = () => {
    let errorFlag = false;
    if (file === null || file === undefined) {
      setFormImageError('Please upload a .jpg product image');
      errorFlag = true;
    }
    if (productName.trim() === '') {
      setFormNameError('Product name cannot be empty');
      errorFlag = true;
    } else if (props.expectedProducts.find((p) => p.name === productName)) {
      setFormNameError(
        'A product with this name already exists! Choose a different name.'
      );
      errorFlag = true;
    }
    if (isNaN(parseFloat(productPrice))) {
      setFormPriceError('Product price must be a number');
      errorFlag = true;
    } else if (parseFloat(productPrice) <= 0.0) {
      setFormPriceError('Product price must greater than 0');
      errorFlag = true;
    }
    if (isNaN(parseFloat(productQuantity))) {
      setFormPriceError('Product price must be a number');
      errorFlag = true;
    } else if (parseFloat(productQuantity) <= 0.0) {
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
        prodID = Math.max(...products.map((p) => p.id)) + 1;
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
        expiry: '',
      };

      products.push(newProduct);
      return products;
    });

    props.handleNewProductModalClose();
  };

  if (chooseInsertType) {
    return (
      <div className="-d-block">
        <div className="d-block text-start">
          Choose template from a list of products that you have already
          inserted.
          <br />
          <small className="text-secondary">
            {' '}
            • No need to retype the product description
            <br />• No need to re-upload the product image
          </small>
          <div className="d-block text-end">
            <button
              className="btn btn-primary"
              onClick={() => switchToTemplateType()}
            >
              Choose
            </button>
          </div>
        </div>
        <hr />
        <div className="d-block text-start">
          Create a new product listing.
          <br />
          <small className="text-secondary">
            {' '}
            • Need to create everyhting from scratch
            <br />• Need to upload a new product image
          </small>
          <div className="d-block text-end">
            <button
              className="btn btn-primary"
              onClick={() => switchToNewInsertForm()}
            >
              Choose
            </button>
          </div>
        </div>
      </div>
    );
  } else if (templateInsertType) {
    return (
      <div className="d-block">
        <div className="d-block text-start">
          <span
            className="link-primary"
            onClick={() => goBackToChooseInsertType()}
          >
            {'< Go Back'}
          </span>
        </div>
        <div className="d-block text-center">
          <h4>Choose the product</h4>
        </div>
        <div className="d-block">
          <div className="list-group overflow-auto height-60vh">
            {
              /*LIST OF THE FARMER PRODUCTS*/
              props.providerProducts.map((product) => (
                <div
                  key={product.id}
                  className="list-group-item list-group-item-action"
                  onClick={() => selectTemplateProduct(product.id)}
                >
                  <div className="row">
                    <div className="col-sm-2">
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          'products/' +
                          product.id +
                          '.jpg'
                        }
                        className="img-fluid rounded-start"
                        alt="Product"
                      />
                    </div>
                    <div className="col-sm-10">
                      <b>{capitalizeEachFirstLetter(product.name)}</b>
                      <br />
                      <small className="text-secondary">
                        {product.description
                          ? product.description
                          : 'No product description'}
                      </small>
                    </div>
                  </div>
                </div>
              ))
            }
            {props.providerProducts.length === 0 && (
              <div className='d-block text-center my-3'>
                You have no previously inserted products
              </div>
            )}
          </div>
        </div>
        <div className="d-block text-center mt-3">
          <small className="text-danger">{templateProductChoiceError}</small>
        </div>
      </div>
    );
  } else if (newInsertType) {
    return (
      <div className="d-block ">
        <div className="d-block text-start">
          <span
            className="link-primary"
            onClick={() => goBackToChooseInsertType()}
          >
            {'< Go Back'}
          </span>
        </div>
        <div className="d-block text-center">
          <h4>Fill in the product details</h4>
        </div>
        <Row className="my-2 g-2">
          <div className="col-md-3">
            {previewImage ? (
              <img className="rounded-circle w-100" src={previewImage} alt="" />
            ) : (
              <div className="text-center rounded-circle">
                No
                <br />
                image
              </div>
            )}
          </div>
          <div className="col-md-9">
            <Form.Group controlId="formFile" className="mt-3">
              <Form.Label>Load product image</Form.Label>
              <Form.Control
                type="file"
                name="product_image"
                accept="image/*"
                onChange={(event) => selectFile(event)}
              />
            </Form.Group>
          </div>
        </Row>
        <Row className=" my-2 g-2">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Product name">
              <Form.Control
                type="text"
                placeholder="Product name"
                value={productName}
                onChange={(event) => setProductNameCheck(event.target.value)}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel
              controlId="floatingSelectGrid"
              label="Product category"
            >
              <Form.Select
                aria-label="Product categories"
                value={categoryID}
                onChange={(event) => setCategoryID(event.target.value)}
              >
                <option value={-1}>Select product category</option>
                {props.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="my-2 g-2">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Unit price (€)">
              <Form.Control
                type="number"
                placeholder="Product price"
                value={productPrice}
                onChange={(event) => setProductPriceCheck(event.target.value)}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingSelectGrid" label="Product unit">
              <Form.Select
                aria-label="Product unit"
                value={productUnit}
                onChange={(event) => setProductUnit(event.target.value)}
              >
                <option value="">Select unit</option>
                <option value="kg">Kg</option>
                <option value="lt">Lt</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Quantity">
              <Form.Control
                type="number"
                placeholder="Quantity"
                value={productQuantity}
                onChange={(event) =>
                  setProductQuantityCheck(event.target.value)
                }
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="my-2 g-2">
          <Col md>
            <FloatingLabel
              controlId="floatingTextarea2"
              label="Product description"
            >
              <Form.Control
                as="textarea"
                value={productDescription ? productDescription : ''}
                onChange={(event) => setProductDescription(event.target.value)}
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
          <button
            className="btn btn-primary"
            onClick={() => insertNewProduct()}
          >
            Insert new product
          </button>
        </div>
      </div>
    );
  } else if (templateInsertForm) {
    return (
      <div className="d-block">
        <div className="d-block text-start">
          <span
            className="link-primary"
            onClick={() => goBackToChooseTemplateType()}
          >
            {'< Go Back'}
          </span>
        </div>
        <div className="d-block text-center">
          <h4>Fill in the product details</h4>
        </div>
        <Row className="my-2 g-2">
          <div className="col-md-3">
            {previewImage ? (
              <img className="rounded-circle w-100" src={previewImage} alt="" />
            ) : (
              <div className="text-center rounded-circle">
                No
                <br />
                image
              </div>
            )}
          </div>
          <div className="col-md-9">
            <Form.Group controlId="formFile" className="mt-3">
              <Form.Label>Replace product image</Form.Label>
              <Form.Control
                type="file"
                name="product_image"
                accept="image/*"
                placeholder={productName + '.jpg'}
                onChange={(event) => selectFile(event)}
              />
            </Form.Group>
          </div>
        </Row>
        <Row className="my-2 g-2">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Product name">
              <Form.Control
                type="text"
                placeholder="Product name"
                value={productName}
                onChange={(event) => setProductNameCheck(event.target.value)}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel
              controlId="floatingSelectGrid"
              label="Product category"
            >
              <Form.Select
                aria-label="Product categories"
                value={categoryID}
                onChange={(event) => setCategoryID(event.target.value)}
              >
                <option value="-1">Select product category</option>
                {props.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="my-2 g-2">
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Unit price (€)">
              <Form.Control
                type="number"
                placeholder="Product price"
                value={productPrice}
                onChange={(event) => setProductPriceCheck(event.target.value)}
              />
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingSelectGrid" label="Product unit">
              <Form.Select
                aria-label="Product unit"
                value={productUnit}
                onChange={(event) => setProductUnit(event.target.value)}
              >
                <option value="">Select unit</option>
                <option value="kg">Kg</option>
                <option value="lt">Lt</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
          <Col md>
            <FloatingLabel controlId="floatingInputGrid" label="Quantity">
              <Form.Control
                type="number"
                placeholder="Quantity"
                value={productQuantity}
                onChange={(event) =>
                  setProductQuantityCheck(event.target.value)
                }
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="my-2 g-2">
          <Col md>
            <FloatingLabel
              controlId="floatingTextarea2"
              label="Product description"
            >
              <Form.Control
                as="textarea"
                value={productDescription ? productDescription : ''}
                onChange={(event) => setProductDescription(event.target.value)}
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
          <button
            className="btn btn-primary"
            onClick={() => insertNewProduct()}
          >
            Insert new product
          </button>
        </div>
      </div>
    );
  }
}

function ModifyProductModalBody(props) {
  /*Utility functions*/
  const capitalizeEachFirstLetter = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  };

  /*new product data*/
  const [file, setFile] = useState(
    props.productID !== -1
      ? props.expectedProducts.find((p) => p.id === props.productID).image
      : null
  );
  const [previewImage, setPreviewImage] = useState(
    props.productID !== -1
      ? URL.createObjectURL(
        props.expectedProducts.find((p) => p.id === props.productID).image
      )
      : null
  );
  const [productName, setProductName] = useState(
    props.productID !== -1
      ? capitalizeEachFirstLetter(
        props.expectedProducts.find((p) => p.id === props.productID).name
      )
      : ''
  );
  const [productDescription, setProductDescription] = useState(
    props.productID !== -1
      ? props.expectedProducts.find((p) => p.id === props.productID).description
      : ''
  );
  const [categoryID, setCategoryID] = useState(
    props.productID !== -1
      ? props.expectedProducts.find((p) => p.id === props.productID).category
      : ''
  );
  const [productPrice, setProductPrice] = useState(
    props.productID !== -1
      ? props.expectedProducts.find((p) => p.id === props.productID).price
      : ''
  );
  const [productUnit, setProductUnit] = useState(
    props.productID !== -1
      ? props.expectedProducts.find((p) => p.id === props.productID).unit
      : ''
  );
  const [productQuantity, setProductQuantity] = useState(
    props.productID !== -1
      ? props.expectedProducts.find((p) => p.id === props.productID).quantity
      : ''
  );

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
  };

  const setProductNameCheck = (name) => {
    setProductName(name.trim());
    if (name.trim() === '') {
      setFormNameError('Product name cannot be empty');
      return;
    }
    setFormNameError('');
  };

  const setProductPriceCheck = (price) => {
    setProductPrice(price);
    if (isNaN(parseFloat(price))) {
      setFormPriceError('Product price must be a number');
      return;
    }
    price = parseFloat(price);
    if (price <= 0.0) {
      setFormPriceError('Product price must greater than 0');
      return;
    }
    setFormPriceError('');
  };

  const setProductQuantityCheck = (qty) => {
    setProductQuantity(qty);
    if (isNaN(parseFloat(qty))) {
      setFormQuantityError('Product quantity must be a number');
      return;
    }
    qty = parseFloat(qty);
    if (qty <= 0.0) {
      setFormQuantityError('Product quantity must greater than 0');
      return;
    }
    setFormQuantityError('');
  };

  const modifyProduct = () => {
    let errorFlag = false;
    if (file === null || file === undefined) {
      setFormImageError('Please upload a .jpg product image');
      errorFlag = true;
    }
    if (productName.trim() === '') {
      setFormNameError('Product name cannot be empty');
      errorFlag = true;
    } else if (
      props.expectedProducts.find(
        (p) => p.name === productName && p.id !== props.productID
      )
    ) {
      setFormNameError(
        'A product with this name already exists! Choose a different name.'
      );
      errorFlag = true;
    }
    if (isNaN(parseFloat(productPrice))) {
      setFormPriceError('Product price must be a number');
      errorFlag = true;
    } else if (parseFloat(productPrice) <= 0.0) {
      setFormPriceError('Product price must greater than 0');
      errorFlag = true;
    }
    if (isNaN(parseFloat(productQuantity))) {
      setFormPriceError('Product price must be a number');
      errorFlag = true;
    } else if (parseFloat(productQuantity) <= 0.0) {
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
      expiry: '',
    };

    props.setExpectedProducts((products) => {
      const prodIndex = products.findIndex((p) => p.id === props.productID);
      products[prodIndex] = modifiedProduct;
      return products;
    });

    props.handleModifyProductModalClose();
  };
  return (
    <div className="d-block">
      <div className="d-block text-center">
        <h4>Modify the necessary product details</h4>
      </div>
      <Row className="my-2 g-2">
        <div className="col-md-3">
          {previewImage ? (
            <img className="rounded-circle w-100" src={previewImage} alt="" />
          ) : (
            <div className="text-center rounded-circle">
              No
              <br />
              image
            </div>
          )}
        </div>
        <div className="col-md-9">
          <Form.Group controlId="formFile" className="mt-3">
            <Form.Label>Replace product image</Form.Label>
            <Form.Control
              type="file"
              name="product_image"
              accept="image/*"
              placeholder={productName + '.jpg'}
              onChange={(event) => selectFile(event)}
            />
          </Form.Group>
        </div>
      </Row>
      <Row className="my-2 g-2">
        <Col md>
          <FloatingLabel controlId="floatingInputGrid" label="Product name">
            <Form.Control
              type="text"
              placeholder="Product name"
              value={productName}
              onChange={(event) => setProductNameCheck(event.target.value)}
            />
          </FloatingLabel>
        </Col>
        <Col md>
          <FloatingLabel
            controlId="floatingSelectGrid"
            label="Product category"
          >
            <Form.Select
              aria-label="Product categories"
              value={categoryID}
              onChange={(event) => setCategoryID(event.target.value)}
            >
              <option value="-1">Select product category</option>
              {props.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
        </Col>
      </Row>
      <Row className="my-2 g-2">
        <Col md>
          <FloatingLabel controlId="floatingInputGrid" label="Unit price (€)">
            <Form.Control
              type="number"
              placeholder="Product price"
              value={productPrice}
              onChange={(event) => setProductPriceCheck(event.target.value)}
            />
          </FloatingLabel>
        </Col>
        <Col md>
          <FloatingLabel controlId="floatingSelectGrid" label="Product unit">
            <Form.Select
              aria-label="Product unit"
              value={productUnit}
              onChange={(event) => setProductUnit(event.target.value)}
            >
              <option value="">Select unit</option>
              <option value="kg">Kg</option>
              <option value="lt">Lt</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
        <Col md>
          <FloatingLabel controlId="floatingInputGrid" label="Quantity">
            <Form.Control
              type="number"
              placeholder="Quantity"
              value={productQuantity}
              onChange={(event) => setProductQuantityCheck(event.target.value)}
            />
          </FloatingLabel>
        </Col>
      </Row>
      <Row className="my-2 g-2">
        <Col md>
          <FloatingLabel
            controlId="floatingTextarea2"
            label="Product description"
          >
            <Form.Control
              as="textarea"
              value={productDescription ? productDescription : ''}
              onChange={(event) => setProductDescription(event.target.value)}
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
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => modifyProduct()}
        >
          Modify product
        </button>
      </div>
    </div>
  );
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

export default FarmerProducts;
