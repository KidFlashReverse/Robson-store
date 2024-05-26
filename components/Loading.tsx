import { CircularProgress } from "@chakra-ui/progress";

export default function Loading({
    isFullScreen,
}: {
    isFullScreen: boolean,
}) {
    return (
        <>
            <CircularProgress size={isFullScreen ? '60%' : '40%'} thickness='5px' isIndeterminate />
        </>
    );
}
