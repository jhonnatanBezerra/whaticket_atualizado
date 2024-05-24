import React from "react";
import { Link } from "react-router-dom";
import { Typography, Button, Grid } from "@material-ui/core"; // Importe os componentes do Material-UI
import notFoundImage from "../../assets/not_found.png";

const NotFoundPage = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
    {/* <img src={notFoundImage} alt="Imagem não encontrada" style={{ width: "50%", marginTop: "20px" }} /> */}
      <Typography variant="h4" gutterBottom>
        404 - Página não encontrada
      </Typography>
      <Typography variant="body1" gutterBottom>
        Desculpe, a página que você está procurando não existe.
      </Typography>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button variant="contained" color="primary" style={{ marginTop: "20px" }}>
          Voltar para a página inicial
        </Button>
      </Link>
    </Grid>
  );
};

export default NotFoundPage;