import { Component, createElement,useState, useEffect, useRef  } from "react";
import "./ui/ProjectView.css";
import { message, Button,} from 'antd';
import 'antd/dist/antd.css';
const ak = `HcFqrgfQDKFgcsqIUas46SumOZSkYLn6`
const url = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${ak}&callback=init`

let map;
const Map= (props) => {
  /*   const {label, tips, data, content, content1, x, y, } = props; */

    const ipt = useRef(null)
    const [lng, setLng] = useState(116.331398)  // 经度
    const [lat, setLat] = useState(39.897445) //维度
    const [province, setProvince] = useState('') // 省份
    const [city, setCity] = useState('') // 城市
    const [district, setDistrict] = useState('') // 区县
    const [street, setStreet] = useState('') // 街道
    const [addressInfo, setAddressInfo] = useState('') // 地址详情
    const [addressList, setAddressList] = useState([]) //


 
    // 增加点击上传信息到mendix中
    const onClick = () => {
      if (ipt.current.value==="") {
      
        message.warning('地址不能为空');
        return
      }
      if (!addressInfo) {
      
        message.warning('请执行地址搜索');
        return
      }
       let location={addressInfo,lng,lat}  //需要传递到mendix的信息{adressInfo:"上海",lng:"241234412",lat:"325414541"}
      props.lng.setValue(lng+"")  //设置经度
      props.lat.setValue(lat+"")      //设置纬度
      props.adress.setValue(addressInfo)  //设置地址详细信息
    props.actionMap.execute()

        // onActionClick && onActionClick.execute(1);
    }
    //关闭页面
    const onClose=()=>{
      props.closeactionMap.execute()
    }



    useEffect(()=>{
      window.init = init;
      loadJScript();
    
    
    },[])
    useEffect(()=>{
      console.log("props.adress.value数据",props.adress.value);
      console.log("ipt.current.value的数据",ipt.current.value);
      if (props.adress.value) {
        getPoint()
      }
     
    
    },[props.adress.value])
  
    const loadJScript = () => {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      // script.src = '//api.map.baidu.com/api?type=webgl&v=1.0&ak=HcFqrgfQDKFgcsqIUas46SumOZSkYLn6&callback=init';
      script.src = url;
      document.body.appendChild(script);
    }
  
    const init = () => {
      const BMap = window.BMapGL;
      map = new BMap.Map('container'); // 创建Map实例
      var point = new BMap.Point(116.331398,39.897445); // 创建点坐标
      map.centerAndZoom('上海市', 10);
      map.enableScrollWheelZoom(); // 启用滚轮放大缩小
    }
  
    const getPoint = () => {
    
      const address = ipt.current.value
      const BMap = window.BMapGL;
      const myGeo = new BMap.Geocoder()
      myGeo.getPoint(address, function(point){
        console.log(point)
        if(point){
          setLng(point.lng)
          setLat(point.lat)
          map.centerAndZoom(point, 13);
          map.addOverlay(new BMap.Marker(point, {title: address}))
          getAddress(point)
        }else{
     
            message.warning('您选择的地址没有解析到结果！');
        }
      },'全国')
    }
  
    const getAddress = (point)=>{
      const BMap = window.BMapGL;
      const geoc = new BMap.Geocoder()
      // const marker = new BMap.Marker(new BMap.Point(lng, lat))
      // map.addOverlay(marker)
      geoc.getLocation(point, function(rs){
        console.log(rs)
        const address = rs.addressComponents
        setAddressInfo(rs.address)
        setAddressList(rs.surroundingPois)
        setProvince((address.province || ''))
        setCity((address.city || ''))
        setDistrict((address.district || ''))
        setStreet((address.street || ''))
        openMsgWindow(rs.address + rs.business)
      })
    }
  
    const openMsgWindow = (info)=>{
      var opts = {
        width: 250,     // 信息窗口宽度
        height: 100, 
      /*   title: ipt.current.value */
      }
      const BMap = window.BMapGL;
      const infoWindow = new BMap.InfoWindow(`地址：${info}`, opts)
      map.openInfoWindow(infoWindow, map.getCenter())
    }
  
  
    return (
      <div className="App">
        <p>
          <span className="sp">省份： {province}</span>
          <span className="sp">城市： {city}</span>
          <span className="sp">区县： {district}</span>
          <span className="sp">街道： {street}</span>
        </p>
        <p>
          <span className="sp">经度： {lng}</span>
          <span>纬度： {lat}</span>
        </p>
        <div>
          <input type="text" ref={ipt} defaultValue={props.adress.value?props.adress.value:""}/>
          <Button type="primary" onClick={getPoint} className="button">搜索</Button>
          <Button type="primary" onClick={onClick } className="button">确定</Button>

        </div>
        <div className="flex">
          <div id="container"></div>
          <div className="list">
            {
              addressList.map((item, index) => {
                return (
                  <div className="item" key={index}>
                    <div className="title">{ item.title }</div>
                    <div className="address"> { item.address } </div>
                  </div>
                )
              }) 
            }
          </div>
        </div>
      </div>
    )
  }

export default Map;
