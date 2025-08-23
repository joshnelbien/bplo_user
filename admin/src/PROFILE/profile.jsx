import { useState } from "react";
import Nav from "../NAV/nav";
import Side_bar from "../SIDE_BAR/side_bar";
import "./profile.css";

function Profile() {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <>
      <Side_bar />
      <Nav />
      
      <div id="main_content">
        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">JD</div>
            <h2 className="profile-name">John Doe</h2>
            <p className="profile-role">Administrator</p>
            
            {/* Profile Type Indicator */}
            <div className={`profile-type-indicator ${
              activeTab === "personal" ? "profile-type-personal" :
              activeTab === "business" ? "profile-type-business" :
              "profile-type-attachments"
            }`}>
              {activeTab === "personal" ? "Personal Profile" :
               activeTab === "business" ? "Business Profile" :
               "attachments Profile"}
            </div>

            {/* Profile Stats */}
            <div className="profile-stats">
              <div className="profile-stat">
                <div className="profile-stat-value">15</div>
                <div className="profile-stat-label">Total Records</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">8</div>
                <div className="profile-stat-label">Active</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">3</div>
                <div className="profile-stat-label">Pending</div>
              </div>
              <div className="profile-stat">
                <div className="profile-stat-value">4</div>
                <div className="profile-stat-label">Completed</div>
              </div>
            </div>
          </div>

          {/* Profile Type Tabs */}
          <div className="profile-tabs">
            <button 
              className={`profile-tab ${activeTab === "personal" ? "active" : ""}`}
              onClick={() => setActiveTab("personal")}
            >
              Personal Profile
            </button>
            <button 
              className={`profile-tab ${activeTab === "business" ? "active" : ""}`}
              onClick={() => setActiveTab("business")}
            >
              Business Profile
            </button>
            <button 
              className={`profile-tab ${activeTab === "attachments" ? "active" : ""}`}
              onClick={() => setActiveTab("attachments")}
            >
              attachments Profile
            </button>
          </div>

          {/* Personal Profile Content */}
          {activeTab === "personal" && (
            <div className="personal-profile">
              <div className="profile-section">
                <h3>Personal Information</h3>
                <div className="personal-fields">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" defaultValue="John" />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" defaultValue="Doe" />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input type="date" defaultValue="1990-01-01" />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select defaultValue="male">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nationality</label>
                    <input type="text" defaultValue="Filipino" />
                  </div>
                  <div className="form-group">
                    <label>Civil Status</label>
                    <select defaultValue="single">
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Contact Information</h3>
                <div className="personal-fields">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" defaultValue="john.doe@email.com" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" defaultValue="+63 912 345 6789" />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea defaultValue="123 Main Street, Quezon City, Metro Manila" />
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Emergency Contact</h3>
                <div className="personal-fields">
                  <div className="form-group">
                    <label>Emergency Contact Name</label>
                    <input type="text" defaultValue="Jane Doe" />
                  </div>
                  <div className="form-group">
                    <label>Emergency Contact Phone</label>
                    <input type="tel" defaultValue="+63 998 765 4321" />
                  </div>
                  <div className="form-group">
                    <label>Relationship</label>
                    <input type="text" defaultValue="Spouse" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Business Profile Content */}
          {activeTab === "business" && (
            <div className="business-profile">
              <div className="profile-section">
                <h3>Business Information</h3>
                <div className="business-fields">
                  <div className="form-group">
                    <label>Business Name</label>
                    <input type="text" defaultValue="Doe Enterprises Inc." />
                  </div>
                  <div className="form-group">
                    <label>Business Type</label>
                    <select defaultValue="corporation">
                      <option value="corporation">Corporation</option>
                      <option value="partnership">Partnership</option>
                      <option value="sole-proprietorship">Sole Proprietorship</option>
                      <option value="cooperative">Cooperative</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Business Registration Number</label>
                    <input type="text" defaultValue="BN-2024-001234" />
                  </div>
                  <div className="form-group">
                    <label>Tax Identification Number</label>
                    <input type="text" defaultValue="123-456-789-000" />
                  </div>
                  <div className="form-group">
                    <label>Business Address</label>
                    <textarea defaultValue="456 Business District, Makati City, Metro Manila" />
                  </div>
                  <div className="form-group">
                    <label>Industry</label>
                    <select defaultValue="technology">
                      <option value="technology">Technology</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail</option>
                      <option value="services">Services</option>
                      <option value="construction">Construction</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Business Contact</h3>
                <div className="business-fields">
                  <div className="form-group">
                    <label>Business Email</label>
                    <input type="email" defaultValue="info@doeenterprises.com" />
                  </div>
                  <div className="form-group">
                    <label>Business Phone</label>
                    <input type="tel" defaultValue="+63 2 8123 4567" />
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input type="url" defaultValue="https://www.doeenterprises.com" />
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>Business Details</h3>
                <div className="business-fields">
                  <div className="form-group">
                    <label>Number of Employees</label>
                    <input type="number" defaultValue="50" />
                  </div>
                  <div className="form-group">
                    <label>Annual Revenue</label>
                    <input type="text" defaultValue="₱10,000,000" />
                  </div>
                  <div className="form-group">
                    <label>Business Description</label>
                    <textarea defaultValue="A technology company specializing in software development and IT consulting services." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* attachments Profile Content */}
          {activeTab === "attachments" && (
            <div className="attachments-profile">
              <div className="profile-section">
                <h3>attachments Information</h3>
                <div className="attachments-fields">
                  <div className="form-group">
                    <label>Agency Name</label>
                    <input type="text" defaultValue="Department of Trade and Industry" />
                  </div>
                  <div className="form-group">
                    <label>Position/Title</label>
                    <input type="text" defaultValue="Senior Trade Specialist" />
                  </div>
                  <div className="form-group">
                    <label>Employee ID</label>
                    <input type="text" defaultValue="DTI-2024-001" />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input type="text" defaultValue="Trade Development Division" />
                  </div>
                  <div className="form-group">
                    <label>Office Address</label>
                    <textarea defaultValue="DTI Building, 361 Sen. Gil J. Puyat Ave, Makati City" />
                  </div>
                  <div className="form-group">
                    <label>Service Years</label>
                    <input type="number" defaultValue="8" />
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>attachments Contact</h3>
                <div className="attachments-fields">
                  <div className="form-group">
                    <label>Official Email</label>
                    <input type="email" defaultValue="john.doe@dti.gov.ph" />
                  </div>
                  <div className="form-group">
                    <label>Office Phone</label>
                    <input type="tel" defaultValue="+63 2 8895 1234" />
                  </div>
                  <div className="form-group">
                    <label>Extension</label>
                    <input type="text" defaultValue="123" />
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>attachments Details</h3>
                <div className="attachments-fields">
                  <div className="form-group">
                    <label>Security Clearance Level</label>
                    <select defaultValue="level-2">
                      <option value="level-1">Level 1</option>
                      <option value="level-2">Level 2</option>
                      <option value="level-3">Level 3</option>
                      <option value="level-4">Level 4</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Supervisor</label>
                    <input type="text" defaultValue="Maria Santos" />
                  </div>
                  <div className="form-group">
                    <label>Responsibilities</label>
                    <textarea defaultValue="Oversees trade development initiatives and coordinates with international partners for trade agreements." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="profile-section">
            <div className="btn-group">
              <button className="btn btn-primary">Save Changes</button>
              <button className="btn btn-secondary">Cancel</button>
              <button className="btn btn-warning">Reset to Default</button>
              <button className="btn btn-danger">Delete Profile</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;