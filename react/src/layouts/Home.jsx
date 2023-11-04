import { Box, Typography } from "@mui/material";

export default function Home(){
    return(
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
            <Typography
                variant="h3"
            >
                Home page
            </Typography>
        </Box>
    );
}