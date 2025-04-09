import * as React from 'react';
import { useSnackbar } from 'notistack';
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';
import Fade from '@mui/material/Fade';
import eventEmitter from './eventEmitter';

const SlideTransition = (props) => <Slide {...props} direction="up" />;
const GrowTransition = (props) => <Grow {...props} />;
const FadeTransition = (props) => <Fade {...props} />;

function CustomizedSnackbar() {
    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        const handleShowSnackbar = ({ message, transition, variant }) => {
            let TransitionComponent;
            switch (transition) {
                case 'slide':
                    TransitionComponent = SlideTransition;
                    break;
                case 'grow':
                    TransitionComponent = GrowTransition;
                    break;
                case 'fade':
                default:
                    TransitionComponent = FadeTransition;
                    break;
            }
            enqueueSnackbar(message, { variant, TransitionComponent });
        };

        eventEmitter.on('showSnackbar', handleShowSnackbar);

        return () => {
            eventEmitter.off('showSnackbar', handleShowSnackbar);
        };
    }, [enqueueSnackbar]);

    return null;
}

export default function IntegrationNotistack() {
    return (
        <CustomizedSnackbar />
    );
}