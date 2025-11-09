// app/listings/[listingId]/page.tsx

import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";
import getReservations from "@/app/actions/getReservations";

interface IParams {
    listingId?: string
}


type PagePropsFix = {
  params: IParams & {
 
    then: any; 
    catch: any; 
    finally?: any; 
    [Symbol.toStringTag]?: any;
  };
};

const ListingPage = async ({ params }: PagePropsFix) => {
  
    const resolvedParams = params as IParams;
    
    const listing = await getListingById(resolvedParams);
    const reservations = await getReservations(resolvedParams);
    const currentUser = await getCurrentUser();

    if (!listing) {
        return (
            <ClientOnly>
                <EmptyState/>
            </ClientOnly>
        )
    }
    return ( <ClientOnly>
      <ListingClient
      listing={listing}
      reservations={reservations}
      currentUser={currentUser}
      />
    </ClientOnly> );
}
 
export default ListingPage;