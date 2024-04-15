import React, {useEffect, useState} from "react";
import {Button, Card, Col, Form, ListGroup, Navbar, Row, Spinner} from "react-bootstrap";
import CustomPagination from "./CustomPagination";
import axios from "axios";
import {getLoggedInUser} from "../utils/repository";
import {useUser} from "./UserContext";
import {Link} from "react-router-dom";
import image from '../assets/company_logo.png';

const Home = () => {
    const {logout} = useUser();
    const loggedInUser = getLoggedInUser();
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [year, setYear] = useState("");

    const [queryResultData, setQueryResultData] = useState([]); // set the query result music data
    const [newlySubscribedMusic, setNewlySubscribedMusic] = useState({}); // set the new subscription music data
    const [currentPage, setCurrentPage] = useState(1); // set the current page
    const pageSize = 4; // show row in list
    const [subscriptionLoading, setSubscriptionLoading] = useState(true);
    const [resultsLoading, setResultsLoading] = useState(false);
    const [userSubscriptionList, setUserSubscriptionList] = useState([]);
    const messageString = "To get started, please enter a search query to find music data.";
    const [displayMessage, setDisplayMessage] = useState(messageString);

    useEffect(() => {
        const payload = {
            "httpMethod": "GET",
            "body": {
                "email": loggedInUser.email
            }
        }
        axios.post('https://bsew8pa20a.execute-api.us-east-1.amazonaws.com/dev/subscriptions', payload)
            .then(function (response) {
                const subscriptions = [];
                response.data.body.map(sub => (subscriptions.push(sub)))
                setUserSubscriptionList(subscriptions);
                setTimeout(() => {
                    setSubscriptionLoading(false);
                }, 800)
            })
            .catch(function (error) {
                console.log(error)
                setTimeout(() => {
                    setSubscriptionLoading(false);
                }, 800)
            })
    }, [newlySubscribedMusic, loggedInUser.email]);

    const handleQuery = (e) => {
        e.preventDefault();
        setResultsLoading(true);

        setCurrentPage(1);

        const payload = {
            body: {
                title: title?.toLowerCase(),
                artist: artist?.toLowerCase(),
                year: year?.toString()
            }
        }

        axios.post('https://bsew8pa20a.execute-api.us-east-1.amazonaws.com/dev/music', payload)
            .then(function (response) {
                console.log(response.data.body.message);
                setQueryResultData(response.data.body.data);
                setTimeout(() => {
                    setResultsLoading(false);
                }, 800);
                if (response.data.body.data.length < 1) {
                    setDisplayMessage("It seems we couldn't find any music matching your search query.");
                }
            })
            .catch(function (error) {
                console.log(error);
                setTimeout(() => {
                    setResultsLoading(false);
                }, 800)
            });
    };

    const paginatedData = queryResultData?.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSubscribe = (music, email) => {
        const payload = {
            "httpMethod": "POST",
            "body": {
                "email": email,
                "music": music,
                "action": "subscribe"
            }
        }
        axios.post('https://bsew8pa20a.execute-api.us-east-1.amazonaws.com/dev/subscriptions', payload)
            .then(function (response) {
                console.log(response.data.body.message);
                setNewlySubscribedMusic(response.data.body.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleUnsubscribe = (music, email) => {
        const payload = {
            "httpMethod": "POST",
            "body": {
                "email": email,
                "music": music,
                "action": "unsubscribe"
            }
        }
        axios.post('https://bsew8pa20a.execute-api.us-east-1.amazonaws.com/dev/subscriptions', payload)
            .then(function (response) {
                console.log(response.data.body.message);
                setNewlySubscribedMusic({});
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <>
            <Navbar className="d-flex justify-content-between" style={{backgroundColor: 'black', color: 'white'}}>
                <div className="d-flex flex-row">
                    <Navbar.Brand>
                        <img src={image} alt='Company Logo' style={{width: '100px', height: '100px', padding: '10px'}}/>
                    </Navbar.Brand>
                    <h3 className="align-content-center">Online Music Subscription Application</h3>
                </div>
                <div className="d-flex flex-row">
                    <h5 className="align-content-center me-5">Hi, {loggedInUser.user_name}</h5>
                    <Link to="/login" className="btn me-4 btn-dark" style={{borderColor: 'white'}} onClick={logout}>
                        Logout
                    </Link>
                </div>

            </Navbar>
            <div className="d-flex">
                <div>
                    <Card style={{height: '80vh', margin: '25px', padding: '8px 16px', minWidth: '280px'}}>
                        <div className="my-4">
                            <span style={{
                                fontSize: '28px',
                                lineHeight: '32px',
                                fontWeight: 800,
                            }}>Subscriptions <i className="bi bi-heart-fill"></i></span>
                        </div>
                        {subscriptionLoading ?
                            <div style={{
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Spinner animation="border"/>
                            </div> :
                            (
                                userSubscriptionList?.length < 1 ?
                                    <div style={{
                                        height: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        maxWidth: '280px'
                                    }}>
                                        <p>It looks like you haven't subscribed to any music yet.</p>
                                    </div> :
                                    (
                                        <ListGroup style={{border: 'none', height: '100%', overflow: 'scroll'}}>
                                            {userSubscriptionList?.map((music, index) => (
                                                <ListGroup.Item key={index} style={{border: 'none'}}>
                                                    <div className="card" style={{
                                                        width: '13rem',
                                                    }}>
                                                        <img className="card-img-top" src={music.artist_image}
                                                             alt="Card cap"/>
                                                        <div className="card-body">
                                                            <div style={{
                                                                display: 'flex',
                                                                flexDirection: 'column'
                                                            }}>
                                                <span style={{
                                                    fontSize: '18px',
                                                    color: "#363636",
                                                    lineHeight: '20px',
                                                    fontWeight: 750,
                                                    marginBottom: '3px'
                                                }}>{music.title} ({music.year})</span>
                                                                <span style={{
                                                                    fontSize: '14px',
                                                                    color: "#605e5e",
                                                                    fontWeight: 550
                                                                }}>{music.artist}</span>
                                                                <div className="d-flex justify-content-end">
                                                                    <Button className="btn-sm btn-danger"
                                                                            onClick={() => handleUnsubscribe(music, loggedInUser.email)}>Remove</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    )
                            )
                        }
                    </Card>
                </div>
                <div style={{marginRight: '20px', width: '100%'}}>
                    <Row className="d-flex flex-row mt-4 mx-4">
                        <Form onSubmit={handleQuery}
                              style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'end',
                                  gap: '8px',
                                  marginBottom: '20px'
                              }}>
                            <Form.Group style={{flex: 1}} className="mx-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" onChange={(e) => {
                                    setTitle(e.target.value)
                                }} value={title}/>
                            </Form.Group>
                            <Form.Group style={{flex: 1}} className="mx-3">
                                <Form.Label>Artist</Form.Label>
                                <Form.Control type="text" onChange={(e) => {
                                    setArtist(e.target.value)
                                }} value={artist}/>
                            </Form.Group>
                            <Form.Group style={{flex: 1}} className="mx-3">
                                <Form.Label>Year</Form.Label>
                                <Form.Control type="number" onChange={(e) => {
                                    setYear(e.target.value)
                                }} value={year}/>
                            </Form.Group>
                            <div className="text-center" style={{
                                minWidth: '150px'
                            }}>
                                <Button type="submit" style={{width: "100%"}} className="btn-dark mx-3">Query</Button>
                            </div>
                        </Form>
                    </Row>
                    <hr/>
                    {resultsLoading ?
                        <div style={{
                            height: '80%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Spinner animation="border"/>
                        </div> :
                        (
                            paginatedData?.length > 0 ? (
                                <Row style={{height: '80%'}}>
                                    <div className="p-4 d-flex flex-column justify-content-between"
                                         style={{height: '100%'}}>
                                        <div>
                                            <h3 className="mb-3">Results</h3>
                                            <ListGroup>
                                                {paginatedData.map((music, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <Row style={{alignItems: 'center'}}>
                                                            <Col md={9}>
                                                                <div style={{display: 'flex', alignItems: 'center'}}>
                                                                    <img src={music.artist_image} alt={music.artist}
                                                                         style={{
                                                                             marginRight: '10px',
                                                                             width: '100px',
                                                                             height: '100px',
                                                                             objectFit: 'cover'
                                                                         }}/>
                                                                    <div>
                                                            <span style={{
                                                                fontSize: '20px',
                                                                color: "#363636",
                                                                lineHeight: '20px',
                                                                fontWeight: 650,
                                                                marginBottom: '3px'
                                                            }}>{music.title}</span>
                                                                        <p style={{marginBottom: '1px'}}>{music.artist}</p>
                                                                        <p>{music.year}</p>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col md={3} style={{textAlign: 'end'}}>
                                                                {(userSubscriptionList.findIndex((sub) => sub.title === music.title) < 0) ?
                                                                    <Button variant="success"
                                                                            onClick={() => handleSubscribe(music, loggedInUser.email)}
                                                                            style={{minWidth: '100px'}}>Subscribe</Button> :
                                                                    <Col style={{textAlign: 'end'}}><Button
                                                                        variant="danger"
                                                                        onClick={() => handleUnsubscribe(music, loggedInUser.email)}
                                                                        style={{minWidth: '100px'}}>Remove</Button></Col>}
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </div>
                                        {queryResultData?.length > 6 &&
                                            <>
                                                <CustomPagination
                                                    itemsCount={queryResultData?.length}
                                                    itemsPerPage={pageSize}
                                                    currentPage={currentPage}
                                                    setCurrentPage={setCurrentPage}
                                                    alwaysShown={true}
                                                />
                                            </>
                                        }
                                    </div>
                                </Row>
                            ) : (
                                <Row style={{height: '80%', width: '100%'}}>
                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <p>
                                            {displayMessage}
                                        </p>
                                    </div>
                                </Row>
                            )
                        )
                    }
                </div>
            </div>
        </>
    );
}

export default Home;

