import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";
import getReservations from "@/app/actions/getReservations";

interface IParams {
    listingId?: string
}

// ⚠️ THE FIX: This type satisfies the strict Next.js/Vercel PageProps constraint
// by explicitly adding the properties of a Promise to your IParams object.
type PagePropsFix = {
  params: IParams & {
    then?: any;
    catch?: any;
    finally?: any;
    [Symbol.toStringTag]?: any;
  };
};

// Use the fix type directly in the component signature
const ListingPage = async ({ params }: PagePropsFix) => {
    // Cast the params back to IParams for clean usage
    const resolvedParams = params as IParams;
    
    // The await is on the action call, NOT on the params object itself
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