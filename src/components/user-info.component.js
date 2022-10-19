import React, { useState } from "react";
import "../css/table.css"


export default function CustomerInfo(props) {
    const [callHistory, setCallHistory] = useState([
        { time: "2022-10-10 10:10", place: "105 Trường chinh, tân phú", car: 4 },
        { time: "2023-10-10 10:10", place: "106 Trường chinh, tân phú", car: 7 },
        { time: "2024-10-10 10:10", place: "107 Trường chinh, tân phú", car: 7 },
        { time: "2025-10-10 10:10", place: "108 Trường chinh, tân phú", car: 4 },
        { time: "2026-10-10 10:10", place: "109 Trường chinh, tân phú", car: 4 },
    ])
    const [place, setPlace] = useState([
        { place: "122 Trường chinh thân phú", count: 7 },
        { place: "123 Trường chinh thân phú", count: 6 },
        { place: "124 Trường chinh thân phú", count: 5 },
        { place: "125 Trường chinh thân phú", count: 4 },
        { place: "126 Trường chinh thân phú", count: 3 }
    ])

    if (!props.warn) {
        return null;
    }
    return (
        <React.Fragment>
            <div className="card card-container">
                <div className="col-md-12">
                    <div className="form-group">
                        <label htmlFor="name">Họ và tên: </label>
                        <input
                            type="text"
                            className="form-control"
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phonecustomer">SDT: </label>
                        <input
                            type="phone"
                            className="form-control"
                            disabled
                        />
                    </div>
                </div>
            </div>
            <div>
                <h1>Lịch sử các cuộc gọi gần nhất:</h1>
            </div>
            <div className="card card-container totalTable">
                <div className="col-md-12">
                    <table>
                        <tbody>
                            <tr>
                                <th>Thời Gian:</th>
                                <th>Địa điểm:</th>
                                <th>Loại xe:</th>
                            </tr>
                            {callHistory.map((val, key) => {
                                return (
                                    <tr key={key}>
                                        <td className="col-3">{val.time}</td>
                                        <td className="col-3">{val.place}</td>
                                        <td className="col-3">{val.car}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <h1>Lịch sử các chuyến đi:</h1>
            </div>
            <div className="card card-container totalTable">
                <div className="col-md-12">
                    <table>
                        <tbody>
                            <tr>
                                <th>Địa điểm:</th>
                                <th>Số lần đi:</th>
                            </tr>
                            {place.map((val, key) => {
                                return (
                                    <tr key={key}>
                                        <td className="col-3">{val.place}</td>
                                        <td className="col-3">{val.count}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </React.Fragment>
    );
}