import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {getUserFromToken} from '../utitlity/auth';
import '../components/applyToJob.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function ApplyToJob() {
    const naviagte = useNavigate();
    useEffect(()=>{ //this functionality for not to show this page while clicking back/forward arrow in browser after logout.
        const token = localStorage.getItem('token');
        if(!token) {
            naviagte('/', {replace: true});
        }
    },[naviagte]);

    const [jobs, getJobs] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedJobType, setSelectedJobType] = useState('');
    const [skills, setSkillInput] = useState('');
    //const [skillArr, setSkills] = useState([]);
    //const [selectedSkill, setSelectedSkill] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    //const [status, setStatus] = useState('');
    const [message, setMessage] = useState({type:'', msg:''})
    const [applications, getApplications] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [appId, setAppId] = useState('');
    //const [updateForm, setUpdateForm] = useState({userId:'', jobId:'', coverLetter:'', skills: []})

    const user = getUserFromToken();
    //console.log(user)
    const locations = jobs.filter(item => item.id==selectedCompany).map(item=>item.location);
    const jobData = jobs.filter(item => item.id==selectedCompany && item.location==selectedLocation).map(item=>item.jobType);
    const role = user.role
    const visibleJobs = role === 'admin' ? applications : applications.filter((application)=>application.user_id===user.userId);
    //console.log(visibleJobs);
    // for (let i = 0; i < applications.length; i++) {
    //     const element = applications[i];
    //     const skill = element.skill;
    //     console.log(element)
    //     for (let i = 0; i < skill.length; i++) {
    //         const element = skill[i];
    //         console.log(element)
    //     }
        
    // }
    
    const handleApplyToJob = (e)=>{
        e.preventDefault();
        applyToJob();
    }

    useEffect(()=>{
         function getJobDetails() {
            axios.get(`${API_URL}/job/jobs`, {}).then((res)=>{
                const data = res.data.jobs;
                //console.log(data);
                const jobData = data[0];
                //const skills = data[1];
                getJobs(jobData);
                //setSkillInput(skills);
            }).catch((err)=>{
                //console.log(err);
                const errMsg = err.response.data.message;
                setMessage({type:'error', msg: errMsg});
            });
        }
        getJobDetails();
    },[]);

    useEffect(()=>{
        const getAppliedJobs = async()=>{
            try{
                const res = await axios.get(`${API_URL}/apply/application`, {});
                const data = res.data.applications;
                console.log(data)
                getApplications(data);
            } catch(err) {
                const errMsg = err.response.data.message;
                setMessage({type:'error', msg: errMsg});
                setTimeout(()=>{
                    setMessage({type:'', msg:''});
                }, 2000);
            }
        }
        getAppliedJobs();
    },[]);

    
    const applyToJob = async()=>{
        const userId = user.userId;
        const jobSkills = skills.split(',').map(skill=>skill.trim()).filter(skill=>skill);
        try {
            const res = await axios.post(`${API_URL}/apply/job`,{userId, jobId:selectedCompany, coverLetter, skills: jobSkills});
            //console.log(res);
            if(res.data) {
                setMessage({type: 'success', msg: res.data.message});
                setTimeout(()=>{
                    setSelectedCompany('');
                    setSelectedLocation('');
                    setSelectedJobType('');
                    setSkillInput('');
                    setCoverLetter('');
                    setMessage({type:'', msg:''});
                },2000);
            }
        } catch(err) {
            //console.log(err);
            const errMsg = err.response.data.message
            setMessage({type:'error', msg: errMsg});
            setTimeout(()=>{
                setMessage({type:'', msg:''});
            },2000);
        }
    }
    
    function handleEditRecord(application){
        console.log(application);
        setIsEditing(true);
        setAppId(application.id);
        setSelectedCompany(application.job_id);
        setSelectedLocation(application.location);
        setSelectedJobType(application.jobType);
        setSkillInput(application.skill);
        setCoverLetter(application.coverletter);
        //setStatus(application.status);
        //setUpdateForm({userId: application.user_id, jobId: application.job_id, coverLetter: application.coverletter, skills: application.skill});
        //console.log(updateForm)
    }
    const handleUpdateAppliedJob = (e)=>{
        e.preventDefault();
        updateAppliedJob();
    }
    const updateAppliedJob = async()=>{
        const updatedSkills = skills.split(',').map(skill=>skill.trim()).filter(skill=>skill);
        try {
            const res = await axios.put(`${API_URL}/apply/updateJob`, {id:appId, jobId: selectedCompany, coverLetter: coverLetter, skills:updatedSkills, status:'pending'});
            if(res.data){
                setMessage({type:'success', msg:res.data.message})
                setTimeout(()=>{
                    setIsEditing(false);
                    setSelectedCompany('');
                    setSelectedLocation('');
                    setSelectedJobType('');
                    setSkillInput('');
                    setCoverLetter('');
                    setMessage({type:'', msg:''});
                },2000);
            }
        }catch(err){
            //console.log(err)
            const errMsg = err.response.data.message
            setMessage({type:'error', msg: errMsg});
            setTimeout(()=>{
                setMessage({type:'', msg:''});
            },2000);
        }
    }

    const cancelUpdate = ()=>{
        // if(isEditing){
            setIsEditing(false);
            setSelectedCompany('');
            setSelectedLocation('');
            setSelectedJobType('');
            setSkillInput('');
            setCoverLetter('');
            //setStatus('');
        // }
    }
    const updateStatus = (id, status)=>{
        console.log(`${id} and ${status}`);
        axios.put(`${API_URL}/apply/${id}/status`, {status}).then((res)=>{
            if(res){
            console.log(res);
        }
        }).catch((err)=>{
            console.log(err);
        })      
    }

  return (
    <div>
        <h2 style={{ padding: "20px" }}>Apply To Job</h2>
        <form action="" onSubmit={isEditing ? handleUpdateAppliedJob : handleApplyToJob} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px'}}>
            <div>
                <label htmlFor="company" style={{flex: '0 0 120px', marginRight: '10px', textAlign: 'left' }}>
                    Company:<span style={{ color: "red", marginLeft: "2px" }}>*</span>
                    <select name="" id="company" value={selectedCompany} onChange={(e)=>setSelectedCompany(e.target.value)} required>
                        <option value="">--select company--</option>
                        {jobs.map((job)=>(<option value={job.id} key={job.id}>{job.company}</option>))}
                    </select>
                </label>
            </div>
            <div>
                <label htmlFor="location" style={{flex: '0 0 120px', marginRight: '10px', textAlign: 'left' }}>
                    Location:<span style={{ color: "red", marginLeft: "2px" }}>*</span>
                    <select name="" id="location" value={selectedLocation} onChange={(e)=>setSelectedLocation(e.target.value)} required>
                        <option value="">--Location--</option>
                        {locations.map((loc, i)=>(<option value={loc} key={i}>{loc}</option>))}
                    </select>
                </label>
            </div>
            <div>
                <label htmlFor="jobTitle" style={{flex: '0 0 120px', marginRight: '10px', textAlign: 'left' }}>
                    TypeOfJob:<span style={{ color: "red", marginLeft: "2px" }}>*</span>
                    <select name="" id="jobTitle" value={selectedJobType} onChange={(e)=>{setSelectedJobType(e.target.value)}} required>
                        <option value="">--Type of job--</option>
                        {jobData.map((job, i)=>(<option value={job} key={i}>{job}</option>))}
                    </select>
                </label>
            </div>
            <div>
                <label htmlFor="skill" style={{flex: '0 0 120px', marginRight: '10px', textAlign: 'left' }}>
                    skill:<span style={{ color: "red", marginLeft: "2px" }}>*</span>
                    <input type="text" id='skill' value={skills} onChange={(e)=> setSkillInput(e.target.value)} placeholder='Enter skill with , seperated' required/>
                </label>
            </div>
            {/* <div>
                <label htmlFor="skill" style={{flex: '0 0 120px', marginRight: '10px', textAlign: 'left' }}>
                    skill:<span style={{ color: "red", marginLeft: "2px" }}>*</span>
                    <select name="" id="skill" value={selectedSkill} onChange={(e)=>setSelectedSkill(e.target.value)} required>
                        <option value="">--select skill--</option>
                        {skills.map((skill)=>(<option value={skill.id} key={skill.id}>{skill.name}</option>))}
                    </select>
                </label>
            </div> */}
            <div>
                <label htmlFor="coverLetter" style={{flex: '0 0 120px', marginRight: '10px', textAlign: 'left' }}>
                    coverLetter:
                    <input type="text" id='coverLetter' value={coverLetter} onChange={(e)=>setCoverLetter(e.target.value)} />
                </label>
            </div>
            {/* {user.role==='admin' &&
            <div>
                <label htmlFor="status" style={{flex: '0 0 120px', marginRight: '10px', textAlign: 'left' }}>
                    status:
                    <input type="text" id='status' value={status} onChange={(e)=>setStatus(e.target.value)} />
                </label>
            </div>
            } */}
            <div>
                <button type='submit' style={{padding: '1px 5px', margin:'5px'}}>{isEditing ? 'Update' : 'Submit'}</button>
                <button onClick={()=>cancelUpdate()} style={{padding: '1px 5px', margin:'5px'}}>Cancel</button>
            </div>
        </form>
        {message.msg && <p style={{color: message.type==='error' ? 'red' : 'green'}}>{message.msg}</p>}
        <div style={{marginTop:'100px'}}>
            <table>
                <caption>Applied job details</caption>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>userName</th>
                        <th>Email</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>jobType</th>
                        <th>skill</th>
                        <th>coverLetter</th>
                        <th>Status</th>
                        {user.role === 'user' &&
                            <th>Edit</th>
                        }
                        {user.role === 'admin' &&
                            <th>Action</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {visibleJobs && visibleJobs.map((item, i)=>(
                        <tr key={item.id}>
                            <td>{i+1}</td>
                            <td>{item.userName}</td>
                            <td>{item.email}</td>
                            <td>{item.company}</td>
                            <td>{item.location}</td>
                            <td>{item.jobType}</td>
                            <td>{item.skill}</td>
                            <td>{item.coverletter}</td>
                            <td>{item.status}</td>
                            {user.role === 'user' &&
                            <td>
                                <button onClick={()=>handleEditRecord(item)} style={{padding: '1px 5px', marginTop:'25px'}}>Update</button>
                            </td>
                            }
                            {user.role==='admin'&&
                            <td>
                                <button onClick={() => updateStatus(item.id, "reviewed")}>
                                    Review
                                </button>
                                <button onClick={() => updateStatus(item.id, "hired")}>
                                    Hire
                                </button>
                                <button onClick={() => updateStatus(item.id, "pending")}>
                                    Reset
                                </button>
                            </td>
                            }
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}
