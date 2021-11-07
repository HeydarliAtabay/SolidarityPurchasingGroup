import { Button, Row } from "react-bootstrap";

function Frontpage(props) {

    return (
        <Row>



            <div>

                <div className="text-center mt-5 mb-3">
                    <h1>Solidarity Purchasing Group</h1>
                </div>

                <div className="text-center mt-5">
                    <h4>Select the appropriate login</h4>
                </div>

                <table className="mx-auto">
                    <tbody>
                        <tr>
                            <td className="py-2 px-4">Client area</td>
                            <td className="justify-content-between py-2 px-4"><Button className="w-100">Login as client</Button></td>
                            <td className="justify-content-between py-2 px-4"><Button className="w-100 btn-secondary">Register</Button></td>
                        </tr>
                        <tr>
                            <td className="py-2 px-4">Farmer area</td>
                            <td className="justify-content-between py-2 px-4"><Button className="w-100">Login as farmer</Button></td>
                            <td className="justify-content-between py-2 px-4"><Button className="w-100 btn-secondary">Register</Button></td>
                        </tr>
                        <tr>
                            <td className="py-2 px-4">Staff area</td>
                            <td className="text-center py-2 px-4"><Button className="w-100">Login as staff</Button></td>
                            <td className="text-center py-2 px-4"><Button className="w-100 btn-secondary">Register</Button></td>
                        </tr>
                        <tr>
                            <td className="py-2 px-4">Delivery person area</td>
                            <td className="text-center py-2 px-4"><Button className="w-100">Login as delivery person</Button></td>
                            <td className="text-center py-2 px-4"><Button className="w-100 btn-secondary">Register</Button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Row>
    );
}

export default Frontpage;