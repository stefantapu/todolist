import { jwtDecode } from 'jwt-decode';
import { useAppSelector } from '../../../app/store';
import { selectUser } from '../model/store/userStore';
import { Avatar, Card, Typography } from '@mui/material';

const Profile = () => {
  const user = useAppSelector(selectUser)!;

  const tokenUntilSec = jwtDecode(user.access_token).exp!;
  const tokenUntil = new Date(tokenUntilSec * 1000).toLocaleDateString();
  return (
    <Card elevation={4} sx={{ padding: 1, margin: 1 }}>
      <Avatar>{user.username.slice(0, 1).toUpperCase()}</Avatar>
      <Typography>{user.username}</Typography>
      <Typography variant="caption">{tokenUntil}</Typography>
    </Card>
  );
};

export default Profile;
