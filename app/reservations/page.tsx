import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import ReservationsClient from "./ReservationsClient";

// Mark as dynamic to prevent static generation during build
export const dynamic = 'force-dynamic';

const ReservationsPage = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return(
            <ClientOnly>
                <EmptyState
                title="Unauthorized"
                subtitle="Please Login"
                />
            </ClientOnly>
        );
    }

    const reservations = await getReservations({
        authorId: currentUser.id
    });

    if (reservations.length == 0) {
        return (
            <ClientOnly>
                <EmptyState
                title="No reservations found"
                subtitle="Looks like you have no reservations on your properties"
                />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <ReservationsClient
            reservations={reservations}
            currentUser={currentUser}
            />
        </ClientOnly>
    )
}

export default ReservationsPage;