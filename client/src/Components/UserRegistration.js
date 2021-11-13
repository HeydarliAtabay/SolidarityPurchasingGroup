import {React, useState} from 'react'
import {Button,Form, Row, Col} from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

function UserRegistration(props){
    const history=useHistory()
    const [name, setName]=useState("")
    const [surname, setSurname]=useState("")
    const [gender, setGender]=useState(1)
    const [date,setDate]=useState("")
    const [email, setEmail]=useState("")
    const [phone, setPhone]=useState("")
    const [country,setCountry] =useState("")
    const [region, setRegion] = useState("")
    const [address, setAdress]=useState("")
    const [city, setCity]=useState("")
    const [password, setPassword]=useState("")
    const [password1, setPassword1]=useState("")
    const [passwordEqual, setPasswordEqual] = useState(0)
    

    const okayStyle = {color: "green" }
    const noStyle={color:"red"}

    return(
        <>
        <h3 className="regText">Registration form</h3>
        <div className="RegistrationForm">
        <Form>
            {/*Personal information*/}
        <Row>
            <Col sm={4}>
            <Form.Group className="mb-3" controlId="formName">
    <Form.Label>Name</Form.Label>
    <Form.Control type="text" placeholder="type your name..." 
    value={name}
    onChange={(ev) => setName(ev.target.value)}
    required />
  </Form.Group>
            </Col>
            <Col sm={4}>
            <Form.Group className="mb-3" controlId="formSurname">
    <Form.Label>Surname</Form.Label>
    <Form.Control type="text" placeholder="type your surname..." 
    value={surname}
    onChange={(ev) => setSurname(ev.target.value)}
    required />
  </Form.Group>
            </Col>
            <Col sm={2}>
            <Form.Label>Male</Form.Label>
            <Form.Group className="mb-3" id="formGridCheckbox">
             <Form.Check type="checkbox" 
             checked={gender}
             onChange={(ev)=>{
                 if(gender)setGender(0)
                 else setGender(1)
             }}
             />
             </Form.Group>
            </Col>
            <Col sm={2}>
            <Form.Label>Female</Form.Label>
            <Form.Group className="mb-3" id="formGridCheckbox">
             <Form.Check type="checkbox"
             checked={!gender}
             onChange={(ev)=>{
                if(gender)setGender(0)
                else setGender(1)
            }}
             />
             </Form.Group>
            </Col>
        </Row>
 {/*Information about birth*/}
        <Row>
            <Col>
            <Form.Group className="mb-3" controlId="formName">
    <Form.Label>Date of Birth</Form.Label>
    <Form.Control type="date" placeholder="type your name..." 
    value={date}
    onChange={(ev)=>{setDate(ev.target.value)}}
    required />
  </Form.Group>
            </Col>
            <Col>
            <Form.Group className="mb-3" controlId="formSurname">
    <Form.Label>Country of Birth</Form.Label>
    <Form.Control placeholder="Please write your country of birth" 
    />
  </Form.Group>
            </Col>
           
        </Row>
        <Row>
           
           
{/*Contact information*/}
        </Row>

  <Row className="mb-3">
    <Form.Group as={Col} controlId="formGridEmail">
      <Form.Label>Email</Form.Label>
      <Form.Control type="email" placeholder="Enter email"
      value={email}
      onChange={(ev)=>{setEmail(ev.target.value)}}
      required
      />
    </Form.Group>

    <Form.Group as={Col} controlId="formGridEmail">
    <Form.Label>Phone</Form.Label>
    <PhoneInput
      placeholder="Enter phone number"
      value={phone}
      onChange={setPhone}
      />
    </Form.Group>
</Row>
<Row>

    <h5>Residence address</h5>
  <div className="pet">
  <Col sm={6}><div className="countReg" ><Form.Label>Country</Form.Label> <CountryDropdown   value={country} onChange={(val) => setCountry(val)} /></div> </Col> 
       

       <Col sm={6}>   <div className="countReg1"><Form.Label>Region</Form.Label> <RegionDropdown  className="countReg"  country={country} value={region} onChange={(val) => setRegion(val)}  blankOptionLabel="Select Region" /></div>
            </Col>  
  </div>
  
       
        

</Row>
 <Row>
     <h5>{" "}</h5>
  <Col><Form.Group className="mb-3" controlId="formAdress">
    <Form.Label>Address</Form.Label>
    <Form.Control placeholder="1234 Main St" 
    value ={address}
    onChange={(ev)=>{setAdress(ev.target.value)}}
    />
  </Form.Group></Col>

  <Col> <Form.Group className="mb-3" controlId="formCity">
    <Form.Label>City</Form.Label>
    <Form.Control placeholder="City"
    value ={city}
    onChange={(ev)=>{setCity(ev.target.value)}}
    />
  </Form.Group></Col>   
     
     </Row>   

   {/*Password details*/}
 
  <Row>
      <Col>
      <Form.Group as={Col} controlId="formGridPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Password" 
      value={password}
      onChange={(ev) => setPassword(ev.target.value)}
      required
      />
    </Form.Group>
      </Col>
  <Col>
  <Form.Group as={Col} controlId="formGridPassword1">
      <Form.Label>Repeat password</Form.Label>
      <Form.Control type="password" placeholder="Password" 
       value={password1}
       onChange={(ev) => {
        setPassword1(ev.target.value)
        if(password===ev.target.value){
            setPasswordEqual(1)
        }
        if(password!==ev.target.value){
            setPasswordEqual(0)
        }
       }
        
        }
       required
      />
     
    </Form.Group>
  </Col>
  {(password1!=="" && passwordEqual ===0) && <span style={noStyle} >passwords are not equal</span>}
  {(password1!=="" && passwordEqual ===1) && <span style={okayStyle}>passwords are  equal</span>}   

  </Row>

 

  
<div className="subBtn">
<Button variant="danger" type="submit" size="lg"
 onClick={(event) => {
    history.push("/")
}}
>
    Cancel
  </Button>
<Button variant="primary" type="submit" size="lg">
    Submit
  </Button>
</div>
 
</Form>
        </div>
       
      </>  
    )


}

export default UserRegistration
