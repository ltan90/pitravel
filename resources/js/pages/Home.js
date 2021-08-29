import React, { Component } from 'react';
import ContentComponent from "../components/ContentComponent";
import PaginationComponent from "../components/PaginationComponent";
import HotelsComponent from "../components/HotelsComponent";
import Header from '../layouts/Header'
import Footer from '../layouts/Footer'
import '../../css/home.css'
import LoadingComponent from '../components/LoadingComponent'
import HotelMiddleware from '../utils/HotelMiddleware';
import SearchComponent from '../components/SearchComponent';
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hotels: [],
            priceAvg: 0,
            posts: [],
            total: 0,
            limit: 10,
            currentPage: 1
        }
        this.HotelMiddleware = new HotelMiddleware();
    }
    handlePageChangeHotel = async (pageNumber) => {
        const params = {
            limit: this.state.limit,
            offset: (pageNumber - 1) * this.state.limit,
        };
        const reponse = await this.HotelMiddleware.getHotels(params);
        this.setState({ hotels: reponse, currentPage: pageNumber });
    }
    onCallbackParent = (data) => {
        this.setState({
            ...this.state,
            ...data
        })
        sessionStorage.setItem('data', JSON.stringify(data.hotels));
    }
    async componentDidMount() {
        const params = {
            limit: 10,
            check_activated: 1
        };
        let result = sessionStorage.getItem('data') ? JSON.parse(sessionStorage.getItem('data')) : await this.HotelMiddleware.getHotels(params);

        const dataPost = await this.HotelMiddleware.getPosts();

        this.setState({
            hotels: result.data,
            posts: dataPost,
            priceAvg: result.avgPriceHotels
            // total: data.meta.total
        })
    }
    
    render() {
        
        return (
            <div>
                <Header>
                    <SearchComponent onCallbackParent={this.onCallbackParent} />
                </Header>
                <div className="content">
                    <div className="row">
                        <div className="col-6 home-container">
                            <ContentComponent onCallbackParent={this.onCallbackParent} dataContent={this.state.posts} />
                        </div>
                        <div className="col-6 home-listhotel-container">
                            {this.state.hotels.length > 0 ? <HotelsComponent hotels={this.state.hotels} priceAvg={this.state.priceAvg}/> : <LoadingComponent />}
                            {/*{this.state.dataHotels && <PaginationComponent*/}
                            {/*    total={this.state.total}*/}
                            {/*    limit={this.state.limit}*/}
                            {/*    currentPage={this.state.currentPage}*/}
                            {/*    itemsCount={this.state.dataHotel?.hotels.length}*/}
                            {/*    onPageChange={(pageNumber) => this.handlePageChangeHotel(pageNumber)}*/}
                            {/*/>}*/}

                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );

    }
}

export default Home;

