import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserFromToken } from '../utitlity/auth';

const API_URL = import.meta.env.VITE_API_URL

export default function PostJob() {
    const naviagte = useNavigate();
    useEffect(()=>{ //this functionality for not to show this page while clicking back/forward arrow in browser after logout.
        const token = localStorage.getItem('token');
        if(!token) {
            naviagte('/', {replace: true});
        }
    },[naviagte]);
    const [companies, setCompany] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setTypeOfJob] = useState('');
    const [jobs, setJobs] = useState([]);
    //const [skill, setSkill] = useState('');
    const [message, setMessage] = useState({type:'', msg:''});

    const handlePostJob = (e)=>{
        e.preventDefault();
        applyToJob();
    }

    useEffect(()=>{
            function getCompanies() {
                axios.get(`${API_URL}/company/companies`).then((res)=>{
                    const companiesData = res.data.companies;
                    //console.log(companiesData)
                    setCompany(companiesData);
                }).catch((error)=>{
                    //console.log(error);
                    const errMsg = error.response?.data;
                    setMessage({type:'error', msg:errMsg});
                })
            }
            getCompanies();
    },[]);
    // async function getCompanies() {   
    // }
    useEffect(()=>{
         function getJobs() {
            axios.get(`${API_URL}/job/jobs`, {}).then((res)=>{
                const data = res.data.jobs;
                //console.log(data);
                const jobData = data[0];
                //const skills = data[1];
                setJobs(jobData);
                //setSkills(skills);
            }).catch((err)=>{
                //console.log(err);
                const errMsg = err.response.data.message;
                setMessage({type:'error', msg: errMsg});
            });
        }
        getJobs();
    },[]);

    const user = getUserFromToken();
    const applyToJob = async() => {
        const userId = user.userId;
        try {
            const res = await axios.post(`${API_URL}/job/postJob`, {companyId: selectedCompany, location, jobType, userId});
            const data = res.data;
            //console.log(data);
            if(data){
                setMessage({type:'success', msg: data.message});
                setTimeout(()=>{
                    setCompany('');
                    setSelectedCompany('');
                    setLocation('');
                    setTypeOfJob('');
                    setMessage({type:'', msg:''})
                }, 2000)
            }
        } catch(err) {
            //console.log(err);
            const errMsg = err.response.data.message;
            setMessage({type:'error', msg: errMsg});
            setTimeout(()=>{
                setMessage({type:'', msg:''})
            }, 2000)
        }
    }

  return (
    <div>
        <h2 style={{ padding: "20px" }}>Post Job</h2>
        <form action="" onSubmit={handlePostJob} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px'}}>
            <div>
                <label htmlFor="company" style={{flex: '0 0 120px', marginRight: '10px', textAlign: 'left' }}>
                    Company:<span style={{ color: "red", marginLeft: "2px" }}>*</span>
                    <select name="" id="company" value={selectedCompany} onChange={(e)=>setSelectedCompany(e.target.value)}  required>
                        <option value="">--select company--</option>
                        {companies.map((company)=> (
                            <option value={company.id} key={company.id}>{company.name}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label htmlFor="location" style={{flex: '0 0 120px', marginRight: '10px', textAlign: 'left' }}>
                    Location:<span style={{ color: "red", marginLeft: "2px" }}>*</span>
                    <input type="text" id='location' value={location} onChange={(e)=>setLocation(e.target.value)}/>
                </label>
            </div>
            <div>
                <label htmlFor="typeOfJob" style={{flex: '0 0 120px', marginRight: '10px', textAlign: 'left' }}>
                    Jobtitle:<span style={{ color: "red", marginLeft: "2px" }}>*</span>
                    <input type="text" id='typeOfJob' value={jobType} onChange={(e)=>setTypeOfJob(e.target.value)} required/>
                </label>
            </div>
            {/* <div>
                <label htmlFor="skill" style={{flex: '0 0 120px', marginRight: '10px', textAlign: 'left' }}>
                    skill:<span style={{ color: "red", marginLeft: "2px" }}>*</span>
                    <input type="text" id='skill' value={skill} onChange={(e)=> setSkill(e.target.value)} placeholder='Enter skill with , seperated' required/>
                </label>
            </div> */}
            <div>
                <button type='submit'>Submit</button>
            </div>
            {/* <label htmlFor="" style={{flex: '0 0 120px', marginRight: '10px', textAlign: 'left' }}>
                coverLetter:
                <input type="text" />
            </label> */}
        </form>
        {message.msg && <p style={{color: message.type === 'error' ? 'red' : 'green'}}>{message.msg}</p>}
        <div style={{marginTop:'100px'}}>
            <table style={{margin:'auto'}}>
                <caption>Job Details</caption>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>UserName</th>
                            <th>Company</th>
                            <th>Location</th>
                            <th>JobType</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs && jobs.map((job,i)=>(
                            <tr>
                                <td>{i+1}</td>
                                <td>{job.userName}</td>
                                <td>{job.company}</td>
                                <td>{job.location}</td>
                                <td>{job.jobType}</td>
                            </tr>   
                        ))}
                    </tbody>
            </table>
        </div>
    </div>
  )
}
