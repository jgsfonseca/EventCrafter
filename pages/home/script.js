$(document).ready(function(){
    var $listing = $('box-listing').isotope({
        itemSelector: '.box-item',
        layoutMode: 'fitRows',
        getSortData:{
            number: '.item-id parseInt'
        }
    });

    $("#filters").on("click", "button",function(){
        var filterValue = $(this).attr('data-filter');
        $listing.isotope({filter: filterValue });

    });

    $("#sorts").on("click", "button", function(){
        var sortValue = $(this).attr('data-sort-by');
        console.log(sortValue);
        $listing.isotope({sortBy: sortValue});
    });
    
})


