import {LinearProgress, Skeleton} from "@mui/material";
import Stack from "@mui/material/Stack";
import React from "react";

export default function LoadingIndicator() {

    return (
        <Stack spacing={2}>
            <LinearProgress color="secondary" />
            <Skeleton variant="rectangular" width={210} height={50} animation={"wave"} />
            <Skeleton variant="rectangular" width={210} height={50} animation={"wave"} />
            <Skeleton variant="rectangular" width={210} height={50} animation={"wave"} />
        </Stack>
    )
}