
import Side_bar from '../SIDE_BAR/side_bar';
import "./dashboard.css";


function Dashboard() {
    return (
        <>
   
            <Side_bar />

            <div id="main_content">


                <div id='analytics-contents'>
                    <div className="pie-chart-section">
                        <h3>Business Distribution</h3>
                        <div className="pie-chart">
                            <div className="slice slice-1"></div>
                            <div className="slice slice-2"></div>
                            <div className="slice slice-3"></div>
                        </div>


                        <ul className="legend">
                            <li><span className="legend-box box-1"></span> Retired</li>
                            <li><span className="legend-box box-2"></span> New Business</li>
                            <li><span className="legend-box box-3"></span> Renew Business</li>
                        </ul>
                    </div>

                    <div className="bar-chart-section">
                        <h3>Monthly Revenue</h3>
                        <div className="bar-chart">
                            <div className="bar" style={{ height: '80%' }}><span>January</span></div>
                            <div className="bar" style={{ height: '60%' }}><span>February</span></div>
                            <div className="bar" style={{ height: '50%' }}><span>March</span></div>
                            <div className="bar" style={{ height: '30%' }}><span>April</span></div>
                            <div className="bar" style={{ height: '70%' }}><span>May</span></div>
                            <div className="bar" style={{ height: '80%' }}><span>June</span></div>
                            <div className="bar" style={{ height: '60%' }}><span>July</span></div>
                            <div className="bar" style={{ height: '50%' }}><span>August</span></div>
                            <div className="bar" style={{ height: '30%' }}><span>September</span></div>
                            <div className="bar" style={{ height: '70%' }}><span>October</span></div>
                            <div className="bar" style={{ height: '30%' }}><span>November</span></div>
                            <div className="bar" style={{ height: '70%' }}><span>December</span></div>
                        </div>
                    </div>
                </div>

                

            </div>
        </>
    );
}

export default Dashboard;