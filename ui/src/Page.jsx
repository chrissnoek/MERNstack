import React from 'react';
import { Navbar, Nav, NavDropdown, Tooltip, OverlayTrigger, Container } from 'react-bootstrap';
import Contents from './Contents.jsx';
import { LinkContainer } from 'react-router-bootstrap';
import { FiPlus, FiMoreVertical } from 'react-icons/fi';
import { IconContext } from "react-icons";
import IssueAddNavItem from './IssueAddNavItem.jsx';

function NavBar() {
    return (
        <IconContext.Provider value={{ style: { color: 'white', verticalAlign: 'middle' } }}>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="#home">Issue Tracker</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <LinkContainer exact to="/"><Nav.Link>Home</Nav.Link></LinkContainer>
                        <LinkContainer exact to="/issues"><Nav.Link>Issue List</Nav.Link></LinkContainer>
                        <LinkContainer exact to="/report"><Nav.Link>Report</Nav.Link></LinkContainer>
                    </Nav>
                    <Nav>
                        <IssueAddNavItem />
                        <NavDropdown title={<FiMoreVertical />} id="collasible-nav-dropdown">
                            <LinkContainer exact to="/about">
                                <NavDropdown.Item>About
                            </NavDropdown.Item>
                            </LinkContainer>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </IconContext.Provider >
    );
}

function Footer() {
    return (
        <small>

            <hr />
            <p className="text-center">
                Full source code available at this
                {' '}
                <a href="https://www.github.com/vasansr/pro-mern-stack-2">
                    Github repository
                </a>
            </p>
        </small>
    );
}

export default function Page() {
    return (
        <div>
            <NavBar />
            <Container>
                <Contents />
            </Container>
            <Footer />
        </div>
    );

}