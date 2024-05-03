import Navbar from "./navbar";

export default function Layout({ children }: any){
    return (
        <>
            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
            }}>
                <div style={{
                    width: '90px',
                    zIndex: 3,
                }}>
                    <Navbar />
                </div>
                <div style={{
                    width: '93.5%',
                    paddingLeft: '5%',
                    paddingTop: '4%',
                    zIndex: 1,
                }}>
                    <main>{children}</main>
                </div>
            </div>
        </>
    )
}