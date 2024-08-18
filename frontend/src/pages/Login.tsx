import { Grid } from "@mui/material";
import LoginForm from "../components/forms/LoginForm";

const Login: React.FC = () => {
    return (
        <Grid container>
        <Grid item xs={3} />
        <Grid item xs={6}>
          <LoginForm />
        </Grid>
        <Grid item xs={3} />
      </Grid>
    );
};

export default Login;
