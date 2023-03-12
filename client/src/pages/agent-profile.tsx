import { useOne } from "@pankod/refine-core";
import { useParams } from "@pankod/refine-react-router-v6";
import {Loader} from '../components/common/Loader';
import { Profile } from "components";

const AgentProfile = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useOne({
    resource: "users",
    id: id as string,
  });

  const myProfile = data?.data ?? [];

  if(isLoading)  return <div style={{alignItems:'center' ,justifyContent:'center', display:'flex', marginTop:'10%'}}><Loader/></div>
  if (isError) return <div>Error...</div>;

  return (
    <Profile
      type="Agent"
      name={myProfile.name}
      email={myProfile.email}
      avatar={myProfile.avatar}
      properties={myProfile.allProperties}
    />
  );
};

export default AgentProfile;