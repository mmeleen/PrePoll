import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { Doughnut, Bar } from "react-chartjs-2";
import API from '../../utils/API';
import Dropdown from "../Dropdown.js";
import { Col, Row, Container, Card } from "react-bootstrap"


function Census() {
    const [censusData, setcensusData] = useState([]);
    const [county, setCounty] = useState([]);
    const [userCounty, setuserCounty] = useState();
    const [countyList, setCountyList] = useState([]);
    //insurance state
    const [IchartData, setIChartData] = useState({});
    //Employment state
    const [EchartData, setEchartata] = useState({});
    //median male v female income
    const [MFchartData, setMFchartData] = useState({});
    //Total Population
    const [populationData, setpopulationData] = useState([]);
    //median income
    const [incomeData, setincomeData] = useState([]);
    //poverty line
    const [povertyData, setpovertyData] = useState([]);

    const [barChart, setBarChart] = useState({});

    useEffect(() => {
        getCensus();
        getCounties();
        usersCountyFN();
    }, []);

    // to get the users county from the users db
    function usersCountyFN() {

        API.checkUserInfo().then(response => {
            console.log(response.data.county);
            setuserCounty(...response.data.county);
            getCensus(response.data.county)

        })
        console.log(userCounty)
    }

    //to get data based on users county selection
    function getCensus(e) {
        console.log(userCounty);
        let countyLocal = e;

        if (!countyLocal) {
            if (userCounty) {
                countyLocal = userCounty + " County";
                console.log(countyLocal)

            } else {
                countyLocal = "Texas"
            }

        }

        setCounty(countyLocal)

        axios.get('/api/census/' + countyLocal).then((response) => {
            setcensusData(response.data);
            chartDataSetter(response.data);
        }).catch(err => {
            console.log(err);
        });
    };

    //get all counties from db
    function getCounties() {
        if (countyList.length) { return }
        axios.get("/api/census/").then(res => res.data)
            .then(response => {
                setCountyList(response);
            }).catch(err => {
                console.log(err)
            })
    };


    function handleFormSubmit(e) {
        e.preventDefault();
        getCensus(county)
    }

    function chartDataSetter(e) {
        console.log(e);
        setpopulationData(e[0].totalpopulation);
        setincomeData(e[0].medianincome);
        setpovertyData(e[0].belowpovertyline);

        setIChartData({
            labels: ['Insured', 'Uninsured'],
            datasets: [
                {
                    data: [e[0].insured, e[0].uninsured],
                    backgroundColor: [
                        '#1D3557',
                        '#C81927'
                    ],
                    borderWidth: 3
                }
            ]
        });
        setEchartata({
            labels: ['Employed', 'Unemployed'],
            datasets: [
                {
                    data: [e[0].employed, e[0].unemployed],
                    backgroundColor: [
                        '#1D3557',
                        '#C81927'
                    ],
                    borderWidth: 3
                }
            ]
        });


        setMFchartData({
            labels: ['Median Male Income', 'Median Female Income'],
            datasets: [
                {
                    data: [e[0].medianmaleincome, e[0].medianfemaleincome],
                    backgroundColor: [
                        '#1D3557',
                        '#C81927'
                    ],
                    borderWidth: 3
                }
            ]
        });

        setBarChart({
            labels: ["Agriculture, Forestry, Fishing, Hunting, and Mining", "Construction", "Manufacturing", "Wholesale Trade", "Retail Trade", "Transportation , Warehousing, and Utilities", "Information", "Finance, Insurance, Real Estate and Rental/Leasing", "Professional scientific management and Administrative waste management services", "Educational Services, Health Care, and Social assistance", "Arts, Entertainment, Recreation, Accommodation, and Food services", "Other services, except public administration", "Public administration"],
            datasets: [
                {
                    data: [e[0].Agricultureforestryfishingandhuntingandmining, e[0].Construction, e[0].Manufacturing, e[0].Wholesaletrade, e[0].Retailtrade, e[0].Transportationandwarehousingandutilities, e[0].Information, e[0].Financeandinsuranceandrealestateandrentalandleasing, e[0].ScientificManagementAdministrativeWastemanagementservices, e[0].Educationalservicesandhealthcareandsocialassistance, e[0].Artsentertainmentandrecreationandaccommodationandfoodservices, e[0].Otherservicesexceptpublicadministration, e[0].Publicadministration],
                    backgroundColor: [
                        '#1D3557',
                        '#457B9D',
                        '#1D3557',
                        '#457B9D',
                        '#1D3557',
                        '#457B9D',
                        '#1D3557',
                        '#457B9D',
                        '#1D3557',
                        '#457B9D',
                        '#1D3557',
                        '#457B9D',
                        '#1D3557'
                    ],
                    borderWidth: 3
                }
            ]
        })
    }


    return (
        <>
            <Container className="container">
                <Row>
                    <Card className="infoCard">
                        <Card.Title><h1 className="header">{county}</h1></Card.Title>
                        <Card.Subtitle> <h2>Select a County to view 2018 Census data:</h2> </Card.Subtitle>
                        <hr />
                        <Col className="countySelector">
                            <form onSubmit={e => handleFormSubmit(e)}>
                                <Dropdown countyList={countyList} county={county} setCounty={setCounty} />
                                <button className="searchCounty" type="submit" value="Submit">Search</button>
                            </form>
                        </Col>
                    </Card>


                    <br></br>
                    {/* <form onSubmit={e => handleFormSubmit(e)}>
                            <Dropdown countyList={countyList} county={county} setCounty={setCounty} />
                            <button className="searchCounty" type="submit" value="Submit">Search</button>
                        </form> */}

                </Row>
            </Container>

            <Container>
                <Row>
                    <div >
                        <Col md={12}>
                            <Card className="card">
                                <Card.Body>
                                    <div className="rawNumbers">
                                        <div> <h2 className="population">Population: {populationData}</h2> </div>
                                        <div> <h2 className="householdimcone">Median Income: ${incomeData}</h2></div>
                                        <div> <h2 className="povertyLine">Families Below the Poverty Line: {povertyData}%</h2></div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </div>
                </Row>
                <Row>

                    <div className="chart Echart" >
                        <Col className="employmentDougnut" md={6}>
                            <Doughnut
                                data={EchartData}
                                options={{
                                    title: {
                                        display: true,
                                        text: "Employed vs. Unemployed",
                                        fontSize: 25,
                                        fontColor: "#021b45"
                                    },
                                    legend: {
                                        display: true,
                                        position: "bottom",
                                        fontSize: 15,
                                        fontColor: "#021b45"
                                    },
                                    responsive: true,
                                    maintainAspectRatio: true,

                                }}
                            />
                        </Col>
                    </div>
                    <div className="chart">
                        <Col md={6}>
                            <Doughnut
                                data={IchartData}
                                options={{
                                    title: {
                                        display: true,
                                        text: "Insured vs. Uninsured",
                                        fontSize: 25,
                                        fontColor: "#021b45"
                                    },
                                    legend: {
                                        display: true,
                                        position: "bottom"
                                    },
                                    responsive: true,
                                    maintainAspectRatio: true,

                                }}
                            />
                        </Col>

                    </div>
                </Row>
                <Row>

                    <div className="chart">
                        <Col md={3}>

                        </Col>
                        <Col md={6}>
                            <Doughnut
                                // censusData={censusData.data}
                                data={MFchartData}
                                options={{
                                    title: {
                                        display: true,
                                        text: "Median Male Income vs. Median Female Income",
                                        fontSize: 25,
                                        fontColor: "#021b45"
                                    },
                                    legend: {
                                        display: true,
                                        position: "bottom"
                                    },
                                    responsive: true,
                                    maintainAspectRatio: true,

                                }}
                            />
                        </Col>
                    </div>

                </Row>
                <Row>
                    <div className="Industrybar">
                        <Col className="Industry" md={11}>
                            <Bar
                                data={barChart}
                                options={{
                                    title: {
                                        display: true,
                                        text: "Population by Industry",
                                        fontSize: 25,
                                        fontColor: "#021b45",
                                        textAlign: "center",
                                        marginBottom: "10px"
                                    },
                                    legend: {
                                        display: false,
                                    },
                                    responsive: true,
                                    maintainAspectRatio: true,
                                }}
                            />

                        </Col>
                    </div>


                </Row>

            </Container>
            <Row>
                <Col md={12}>
                    <Container className="disclaimerContainer">
                        <div><p className="disclaimer"> *All the data presented here is sourced from the acs census data collected in 2018</p></div>
                    </Container>
                </Col>
            </Row>
        </>
    )
}
export default Census;