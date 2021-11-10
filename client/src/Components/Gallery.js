import {Link} from 'react-router-dom'


function ProductGallery(props){

    return(
        <div style ={{textAlign: "center"}}>
            <li className ="flex-container">
                    {props.imgN.map( img => {
                        console.log(img) 
                            return ( <DisplayProduct prodImg={img}/>);
                    })}
            </li>
        </div>

    )
}

function DisplayProduct(props){

    const styleObj = {
        width: 300,
        height: 300,
    };
    let link ="/products"+props.prodImg
    return(
    
    <Link to={link}>
        <img className = "image"
            style = {styleObj}
            key = {props.prodImg}
            src = {process.env.PUBLIC_URL +'products/'+ props.prodImg}
            alt = {props.prodImg}
        >
        </img>
   </Link>)

}

export default ProductGallery




