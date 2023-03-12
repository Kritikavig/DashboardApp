import { useGetIdentity, useOne } from "@pankod/refine-core";
import { Profile } from "components";
import {Loader} from '../components/common/Loader';

const MyProfile = () => {
  const {data:user} = useGetIdentity();
  const {data,isError,isLoading} = useOne({resource: "users", id:user?.userid});

  const myProfile = data?.data ?? [];

  if(isLoading)  return <div style={{alignItems:'center' ,justifyContent:'center', display:'flex', marginTop:'10%'}}><Loader/></div>
  if(isError) return<div>Error...</div>

  return (
      <Profile
      type="My"
      name={myProfile.name}
      email={myProfile.email} 
      avatar={myProfile.avatar}
      properties={myProfile.allProperties} 
      />    
  )
}

export default MyProfile
