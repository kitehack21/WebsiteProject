import React, {Component} from 'react'
import axios from 'axios'
import {API_URL_1, API_URL_ALBUM_COVERS} from '../supports/api-url/apiurl'
import AlbumsDataTable from './AlbumsDataTable'
import ArtistsDataTable from './ArtistsDataTable'
import GenresDataTable from './GenresDataTable'
import TracksDataTable from './TracksDataTable'
import IntegrationReactSelect from './MultiSelect'
import "../css/datatables.css"

class Admin extends Component{

    state= {data: [], listTables: [], listArtists: [], listAlbums: [], selectedGenres:[]}
 
    componentWillMount(){
        this.refreshData()
    }

    refreshData(){
        axios.get(API_URL_1 + "/admin",{
            params:{
                table: this.props.match.params.table
            }
        })
        .then((response)=>{
            console.log(response.data)
            this.setState({listArtists: response.data.listArtists, listAlbums: response.data.listAlbums, data: response.data.table})
        })
    }
    

    onTableSelect(TABLE_NAME){
        var url = "/Admin/" + TABLE_NAME
        axios.get(API_URL_1 + "/admin",{
            params:{
                table: TABLE_NAME
            }
        })
        .then((response)=>{
            console.log(response.data)
            this.setState({listTables: response.data.listTables, data: response.data.table })
        })
        this.props.history.push(url)
    }

    onEnterClickAlbums(){
        var data = {
            artist_id: this.refs.addArtist.value,
            album_name: this.refs.addAlbum.value,
            release_date: this.refs.addReleaseDate.value,
            album_art: this.refs.addAlbumArt.value,
            description: this.refs.addDescription.value,
        }

        axios.post(API_URL_1 + "/admin/albums", data)
            .then((res)=>{
                console.log(res)
                var data1 = {
                    album_id: res.data.insertId,
                    genres: this.state.selectedGenres
                }
                axios.post(API_URL_1 + "/albumgenres", data1)
                .then((res)=>{
                    alert("SUCCESS")
                    this.refs.addAlbum.value = ""
                    this.refs.addReleaseDate.value = ""
                    this.refs.addAlbumArt.value = ""
                    this.refs.addDescription.value = ""
                    this.refreshData()
                })
            })
            .catch((err)=>{
                console.log(err)
                alert("ERROR")
            })    
    }
    onEnterClickArtists(){
        var data = {
            name: this.refs.addName.value,
            birthday: this.refs.addBirthday.value,
            debut: this.refs.addDebut.value,
            agency: this.refs.addAgency.value,
            picture: this.refs.addPicture.value}

        axios.post(API_URL_1 + "/admin/artists" , data)
            .then((res)=>{
                console.log(res)
                alert("SUCCESS")
                this.refs.addName.value = ""
                this.refs.addBirthday.value = ""
                this.renderGenresDataTable.addDebut = ""
                this.refs.addAgency.value = ""
                this.refs.addPicture.value =""
                this.refreshData()
            })
            .catch((err)=>{
                console.log(err)
                alert("ERROR")
            })    
    }
    onEnterClickGenres(){
        var data = {
            name: this.refs.addGenre.value,
        }
        axios.post(API_URL_1 + "/admin/genres" , data)
            .then((res)=>{
                console.log(res)
                alert("SUCCESS")
                this.refreshData()
            })
            .catch((err)=>{
                console.log(err)
                alert("ERROR")
            })    
    }
    
    onEnterClickTracks(){
        var data = {
            artist_id: this.refs.editArtist.value,
            album_name: this.refs.editAlbum.value,
            release_date: this.refs.editReleaseDate.value,
            album_art: this.refs.editAlbumArt.value,
            description: this.refs.editDescription.value}

        axios.post(API_URL_1 + "/admin/tracks" , data)
            .then((res)=>{
                console.log(res)
                alert("SUCCESS")
                this.refreshData()
            })
            .catch((err)=>{
                console.log(err)
                alert("ERROR")
            })    
    }

    renderTableSelect(){
        function activeSelect(){
            return(
                {
                    albums: ()=>{return ["selected", "", "" ,""]},
                    artists: ()=>{return ["", "selected", "" ,""]},
                    tracks: ()=>{return ["", "" , "selected", ""]},
                    genres: ()=>{return ["", "" ,"", "selected"]}
                }
            )
        }
        return(
            <select  id="tableSelect" ref="tableSelection" onChange={()=>this.onTableSelect(this.refs.tableSelection.value)}>
                <option value="albums" selected = {activeSelect()[this.props.match.params.table]()[0]}>Albums</option>
                <option value="artists" selected = {activeSelect()[this.props.match.params.table]()[1]}>Artists</option>
                <option value="tracks" selected = {activeSelect()[this.props.match.params.table]()[2]}>Tracks</option>
                <option value="genres" selected = {activeSelect()[this.props.match.params.table]()[3]}>Genres</option>
            </select>
        )
    }

    sorter(fn, array){ 
        for (let i = 0; i < array.length-1; i ++){
            for (let j = i+1; j < array.length; j++){
                if(fn(array[i],array[j])){
                    var temp = array[i];
                        array[i] = array[j];
                        array[j] = temp;
                }
            }
        }
        return array;
    }
    sortAsc(param){
        var sortedArr = this.sorter(function(a,b){
            return  (a[param] > b[param]) ;
            },this.state.data);
        this.setState({data : sortedArr})
    }
    sortDesc(param){
        var sortedArr = this.sorter(function(a,b){
            return  (a[param] < b[param]) ;
            },this.state.data);
        this.setState({data : sortedArr})
    }

    renderAlbumsTableHead(){
        return(
            <thead>
                <tr>
                <th  style={{width: "2%"}}>ID</th>
                <th  style={{width: "12%"}}>Artist<input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortAsc("artist_name")} value="^"/><input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortDesc("artist_name")} value="v"/></th>
                <th  style={{width: "20%"}}>Album Name <input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortAsc("album_name")} value="^"/><input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortDesc("album_name")} value="v"/></th>
                <th  style={{width: "8%"}}>Release Date <input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortAsc("release_date")} value="^"/><input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortDesc("release_date")} value="v"/></th>
                <th  style={{width: "10%"}}>Album Art </th>
                <th  style={{width: "30%"}}>Description</th>
                <th  style={{width: "7%"}}>Actions</th>
                </tr>
            </thead>
        )
    }

    renderAlbumsDataTable(){
        return this.state.data.map((item) =>
        <AlbumsDataTable key={item.album_id} table={this.props.match.params.table} listArtists={this.state.listArtists} artist_name={item.artist_name} album_id={item.album_id} 
        album_name={item.album_name} release_date={item.release_date} album_art={`${API_URL_ALBUM_COVERS}/${item.album_art}`} description={item.description} refresh={()=>this.refreshData()}/>)
    }

    renderArtistsTableHead(){
        return(
            <thead>
                <tr>
                <th style={{width: "2%"}}>ID</th>
                <th style={{width: "10%"}}>Name<input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortAsc("name")} value="^"/><input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortDesc("name")} value="v"/></th>
                <th style={{width: "10%"}}>Debut<input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortAsc("debut")} value="^"/><input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortDesc("debut")} value="v"/></th>
                <th style={{width: "10%"}}>Birthday<input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortAsc("birthday")} value="^"/><input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortDesc("birthday")} value="v"/></th>
                <th style={{width: "15%"}}>Agency<input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortAsc("agency")} value="^"/><input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortDesc("agency")} value="v"/></th>
                <th style={{width: "10%"}}>Artist Picture</th>
                <th style={{width: "20%"}}>Actions</th>
                </tr>
            </thead>
        )
    }

    renderArtistsDataTable(){
        return this.state.data.map((item) =>
        <ArtistsDataTable key={item.id} id={item.id} table={this.props.match.params.table} name={item.name} debut={item.debut} 
        birthday={item.birthday} agency={item.agency} picture={item.picture} refresh={()=>this.refreshData()}/>)
    }

    renderTracksTableHead(){
        return(
            <thead>
                <tr>
                <th style={{width: "2%"}}>ID</th>
                <th style={{width: "10%"}}>Album<input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortAsc("album_name")} value="^"/><input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortDesc("album_name")} value="v"/></th>
                <th style={{width: "10%"}}>Artist<input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortAsc("artist_name")} value="^"/><input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortDesc("artist_name")} value="v"/></th>
                <th style={{width: "5%"}}>Track No.</th>
                <th style={{width: "15%"}}>Track Name<input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortAsc("name")} value="^"/><input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortDesc("name")} value="v"/></th>
                <th style={{width: "11%"}}>Playtime<input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortAsc("playtime")} value="^"/><input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortDesc("playtime")} value="v"/></th>
                <th style={{width: "5%"}}>Title-Track</th>
                <th style={{width: "11%"}}>Ranking<input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortAsc("ranking")} value="^"/><input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortDesc("ranking")} value="v"/></th>
                <th style={{width: "13%"}}>Actions</th>
                </tr>
            </thead>
        )
    }

    renderTracksDataTable(){
        return this.state.data.map((item) =>
        <TracksDataTable key={item.id} id={item.id} table={this.props.match.params.table} listArtists={this.state.listArtists} album_name={item.album_name} artist_name={item.artist_name} 
        number={item.number} name={item.name} playtime={item.playtime} title_track={item.title_track} ranking={item.ranking} refresh={()=>this.refreshData()}/>)
    }

    renderGenresTableHead(){
        return(
            <thead>
                <tr>
                <th style={{width: "2%"}}>ID</th>
                <th style={{width: "8%"}}>Name<input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortAsc("name")} value="^"/><input type="button" className="btn btn-info" style={{"margin-left":"10px"}} onClick={()=>this.sortDesc("name")} value="v"/></th>
                <th style={{width: "20%"}}>Actions</th>
                </tr>
            </thead>
        )
    }

    renderGenresDataTable(){
        return this.state.data.map((item) =>
        <GenresDataTable key={item.id} id={item.id} name={item.name} table={this.props.match.params.table} description={item.description} refresh={()=>this.refreshData()}/>)
    }
    
    renderFullTable(){
        return(
            {
                albums: () => {return (
                    <table className="table table-striped m-b-none">
                        {this.renderAlbumsTableHead()}
                        <tbody>
                        {this.renderAlbumsDataTable()}
                        </tbody>
                    </table>
                )},
                artists: () =>{return(
                    <table className="table table-striped m-b-none">
                        {this.renderArtistsTableHead()}
                        <tbody>
                        {this.renderArtistsDataTable()}
                        </tbody>
                    </table>

                )},
                genres: () =>{return(
                    <table className="table table-striped m-b-none">
                        {this.renderGenresTableHead()}
                        <tbody>
                        {this.renderGenresDataTable()}
                        </tbody>
                    </table>

                )},
                tracks: () =>{return(
                    <table className="table table-striped m-b-none">
                        {this.renderTracksTableHead()}
                        <tbody>
                        {this.renderTracksDataTable()}
                        </tbody>
                    </table>

                )}
            }
        )
    }

    onGenreSelect(value){
        this.setState({selectedGenres: value})
    }

    renderDataInput(){
        return(
            {
                albums: () => {
                    return (
                    <table className="table table-striped m-b-none">
                        <tr className="table-border">
                            <td>
                                <select ref="addArtist" id="addArtist">
                                <option value={0} className="text-muted">---Select Artist---</option>
                                {this.renderArtistSelect()}
                                </select>
                            </td>
                            <td><input type="text" id="addAlbum" ref="addAlbum" placeholder="Enter Album Name" style={{width: 200}}/></td>
                            <td><input type="text" id="addReleaseDate" ref="addReleaseDate" placeholder="Enter release date" style={{width: 120}}/></td>
                            <td><input type="text" id="addAlbumArt" ref="addAlbumArt" placeholder="Enter picture link" /></td>
                            <td style={{width: "10%"}}><textarea id="addDescription" ref="addDescription" placeholder="Enter album description" style={{resize:"none"}} rows= '4' cols= '40'/></td>
                            <td style={{width: "20%"}}><IntegrationReactSelect onGenre={this.onGenreSelect.bind(this)}/></td>
                            <td style={{width: "8%"}}>
                                <input type="button" className="btn btn-info" style={{width: 70}} onClick={()=>this.onEnterClickAlbums()} value="Enter"/>
                            </td>
                        </tr>
                    </table>
                )},
                artists: () =>{
                    return(
                    <table className="table table-striped m-b-none">
                        <tr className="table-border">
                            <td style={{width: "8%"}}><input type="text" ref="addName" placeholder="Enter Artist Name" /></td>
                            <td style={{width: "8%"}}><input type="text" ref="addDebut" placeholder="Enter Debut Date" /></td>
                            <td style={{width: "8%"}}><input type="text" ref="addBirthday" placeholder="Enter Birthday (if applicable)" style={{"width": 200}}/></td>
                            <td style={{width: "8%"}}><input type="text" ref="addAgency" placeholder="Enter Artist's agency" /></td>
                            <td style={{width: "8%"}}><input type="text" ref="addPicture" placeholder="Enter Picture Link" /></td>
                            <td>
                                <input type="button" className="btn btn-info" style={{width: 70}} onClick={()=>this.onEnterClickArtists()} value="Enter"/>
                            </td>
                        </tr>
                    </table>

                )},
                genres: () =>{
                    return(
                    <table className="table table-striped m-b-none">
                        <tr className="table-border">
                            <td><input type="text" ref="addGenre" placeholder="Enter Genre Name" /></td>
                            <td>
                                <input type="button" className="btn btn-info" style={{width: 70}} onClick={()=>this.onEnterClickGenres()} value="Enter"/>
                            </td>
                        </tr>
                    </table>

                )},
                tracks: () =>{
                    return(
                    <table className="table table-striped m-b-none">
                        <tr className="table-border">
                            <td>
                                <select ref="addArtist2" id="addArtist2">
                                <option value={0} className="text-muted">---Select Album---</option>
                                {this.renderAlbumSelect()}
                                </select>
                            </td>
                            <td>
                                <select ref="addArtist2" id="addArtist2">
                                <option value={0} className="text-muted">---Select Artist---</option>
                                {this.renderArtistSelect()}
                                </select>
                            </td>
                            <td><input type="number" ref="addTracknumber" style={{"width":"20px"}}/></td>
                            <td><input type="text" ref="addTrackname" placeholder="Enter Track Name" /></td>
                            <td><input type="text" ref="addPlaytime" placeholder="Enter Playtime" /></td>
                            <td>
                                <select ref="addTitletrack" id="addTitletrack">
                                    <option value={0} >No</option>
                                    <option value={1} >Yes</option>
                                </select>
                            </td>
                            <td><input type="text" ref="addRanking" placeholder="Enter Ranking" /></td>
                            <td>
                                <input type="button" className="btn btn-info" style={{width: 70}} onClick={()=>this.onEnterClickTracks()} value="Enter"/>
                            </td>
                        </tr>
                    </table>

                )}
            }
        )
    } 

    renderArtistSelect(){
        var arrJSX = this.state.listArtists.map((item)=>{
            if(this.props.artist_name === item.name){
                return(
                    <option value={item.id} id={item.id} selected="selected">{item.name}</option>
                    )
            }
            else{
                return(
                    <option value={item.id} id={item.id}>{item.name}</option>
                    )
            }
            
        })
        return arrJSX
    }

    renderAlbumSelect(){
        var arrJSX = this.state.listAlbums.map((item)=>{
            if(this.props.album_name === item.album_name){
                return(
                    <option value={item.id} id={item.id} selected="selected">{item.album_name}</option>
                    )
            }
            else{
                return(
                    <option value={item.id} id={item.id}>{item.album_name}</option>
                    )
            }
            
        })
        return arrJSX
    }

    render(){
        return(
        <section id="content">
            <section className="vbox">
                <section className="scrollable padder ">
                    <div className="m-b-md">
                        <h3 className="m-b-none">Admin Dashboard</h3>
                    </div>
                    <section className="panel panel-default">
                    Select Datatable:
                    <br/>
                    {this.renderTableSelect()}
                    <br/>
                    {this.renderDataInput()[this.props.match.params.table]()}
                    <header className="panel-heading">
                    Data
                        <i className="fa fa-info-sign text-muted"></i> 
                    </header>
                    <div className="table-responsive">
                        {this.renderFullTable()[this.props.match.params.table]()}
                    </div>
                    </section>
                </section>
            </section>
        </section>
        )
    }
}

export default Admin