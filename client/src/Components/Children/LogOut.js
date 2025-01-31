import { Container, Col, Button } from "react-bootstrap";
import MakeRequest from '../Helpers/MakeRequest';

export default ({ initData }) => {
    const { logout, togglelogout } = initData;
    const handleLogout = async (event) => {
        event.preventDefault();
        const response = await MakeRequest({}, 'logout', 'post');
        window.location.reload();
    };

    return (<>
        <Container className="container-fluid d-flex justify-content-center align-items-center">
            <Col  xl={3} lg={4} md={7} sm={7} xs={10} className="logOutWindow py-5 px-2 text-center">
                <i onClick={() => togglelogout(false)} className="fa fa-times"></i>
                Are you sure you want to log out?
                <Container className="container-fluid d-flex justify-content-around mt-4">
                    <Button onClick={(e) => handleLogout(e)}>Log out</Button>
                    <Button onClick={() => togglelogout(false)}>Cancel</Button>
                </Container>
            </Col>
        </Container>
    </>)
};