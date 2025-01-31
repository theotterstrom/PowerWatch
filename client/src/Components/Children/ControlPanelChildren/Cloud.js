import MakeRequest from "../../Helpers/MakeRequest";
import React, { useState, useEffect } from "react";
import { Form, Button, Dropdown, Container } from "react-bootstrap";
export default () => {
    const [shellyCred, setShellyCred] = useState({
        shellyUrl: '',
        shellyToken: '',
        powerArea: ''
    });


    useEffect(() => {
        const fetchShelly = async () => {
            const shellyRes = await MakeRequest(null, 'shellycredentials', 'get')
            setShellyCred(shellyRes.data);
        };
        fetchShelly()
    }, []);

    const setSettings = async (e) => {
        e.preventDefault();
        const res = await MakeRequest(shellyCred, 'setshellycredentials', 'post');
        alert(res.response?.data?.message || res.data.message)
    };
    const handleShellyChange = (e) => {
        const { name, value } = e.target;
        setShellyCred((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (<>
        <Container className="mt-2">
            <h4>Cloud settings</h4>
            <Form onSubmit={setSettings} className="mt-5" style={{ paddingBottom: "20px" }}>
                <Form.Label>Shelly-url</Form.Label>
                <Form.Control placeholder="Shelly-url" type="text" value={shellyCred.shellyUrl} name="shellyUrl" onChange={handleShellyChange}>
                </Form.Control>
                <Form.Label className="mt-3">Shelly-token</Form.Label>
                <Form.Control placeholder="Shelly-token" type="text" value={shellyCred.shellyToken} name="shellyToken" onChange={handleShellyChange}>
                </Form.Control>
                <Form.Label className="mt-3">Power Area</Form.Label>

                <Dropdown
                    style={{ backgroundColor: "#f8f9fa", borderRadius: "5px" }}
                    onSelect={(eventKey) => {
                        setShellyCred({ ...shellyCred, powerArea: eventKey });
                    }}
                >
                    <Dropdown.Toggle variant="light" style={{ width: "100%", textAlign: "start" }}>
                        {shellyCred.powerArea ?? "Select Area"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="Power Area 1">Power Area 1</Dropdown.Item>
                        <Dropdown.Item eventKey="Power Area 2">Power Area 2</Dropdown.Item>
                        <Dropdown.Item eventKey="Power Area 3">Power Area 3</Dropdown.Item>
                        <Dropdown.Item eventKey="Power Area 4">Power Area 4</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Button className="mt-4" type="submit">Save settings</Button>
            </Form>
        </Container>
    </>);
};