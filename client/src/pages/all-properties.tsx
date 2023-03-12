import { Add } from "@mui/icons-material";
import { useTable } from "@pankod/refine-core";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
} from "@pankod/refine-mui";
import { useNavigate } from "@pankod/refine-react-router-v6";
import { useMemo } from "react";
import {Loader} from '../components/common/Loader';

import { PropertyCard, CustomButton } from "components";

const AllProperties = () => {
  const navigate = useNavigate();
  const {
    tableQueryResult: { data, isLoading, isError },
    current,
    setCurrent,
    setPageSize,
    pageCount,
    sorter,
    setSorter,
    filters,
    setFilters,
  } = useTable(); //data contains all information entered by user
  const allProperties = data?.data ?? []; //if data is present get that else get empty array

  const currentPrice = sorter.find((item)=>item.field==='price')?.order;  //find field of price and order of it
  const toggleSort = (field: string) => {
    setSorter([{field, order: currentPrice==='asc' ? 'desc' : 'asc'}]); //choose field of price, perform sorting in particular fashion
  }

  const currentFilterValues = useMemo(() => {
    //import filters from useTable
    const logicalFilters = filters.flatMap((item) =>"field" in item ? item : [],);

    return {  //return title and property type according to filter 
      title: logicalFilters.find((item) => item.field === "title")?.value || "",
      propertyType: logicalFilters.find((item) => item.field === "propertyType")?.value || "",
    };
  }, [filters]);

  if(isLoading)  return <div style={{alignItems:'center' ,justifyContent:'center', display:'flex', marginTop:'10%'}}><Loader/></div>
  if (isError) return <Typography>Error ...</Typography>;

  return (
    <Box>
      <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Stack direction="column" width="100%">
          <Typography fontSize={25} fontWeight={700} color="#11142d">
            {!allProperties.length
              ? "There are no properties"
              : "All Properties"}
          </Typography>
          <Box
            mb={2}
            mt={3}
            display="flex"
            width="84%"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <Box
              display="flex"
              gap={2}
              flexWrap="wrap"
              mb={{ xs: "20px", sm: 0 }}
            >
              <CustomButton
                title={`Sort Price ${currentPrice=== 'asc' ? '↑' : '↓' }`}
                handleClick={() => toggleSort('price')}
                backgroundColor="#475be8"
                color="#fcfcfc"
              />
              <TextField
                variant="outlined"
                color="info"
                placeholder="Search by title"
                value={currentFilterValues.title}
                onChange={(e) => { 
                  setFilters([
                    {
                    field:'title',
                    operator:'contains',
                    value : e.currentTarget.value? e.currentTarget.value: undefined
                    }
                  ])
                }}
              />
              <Select
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "arial-label": "Without label" }}
                defaultValue=""
                value={currentFilterValues.propertyType}
                onChange={(e) => { 
                  setFilters([
                    {
                    field:'propertyType',
                    operator:'eq',
                    value : e.target.value,
                    }
                  ], 'replace')
                }}
              >
              <MenuItem value="">All</MenuItem>
               {[
                   "Apartment",
                   "Villa",
                   "Farmhouse",
                   "Duplex",
                   "Townhouse",
                   "Flat",
                   "Cottage",
                   "Studio",
               ].map((type) => (<MenuItem    key={type}    value={type.toLowerCase()}>
                  {type}
                   </MenuItem>
               ))}
              </Select>
            </Box>
          </Box>
        </Stack>
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <CustomButton
          title="Add Property"
          backgroundColor="#475be8"
          color="#fcfcfc"
          icon={<Add />}
          handleClick={() => navigate("/properties/create")}
        />
      </Stack>

      <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {allProperties.map((property) => (
          <PropertyCard
            key={property._id}
            id={property._id}
            title={property.title}
            price={property.price}
            photo={property.photo}
            location={property.location}
          />
        ))}
      </Box>

      {allProperties.length > 0 && (
        <Box display="flex" gap={2} mt={3} flexWrap="wrap">
          <CustomButton
            title="Previous"
            color="#fcfcfc"
            backgroundColor="#475be8"
            disabled={!(current > 1)}
            handleClick={() => setCurrent((prev) => prev - 1)}
          />

          <Box
            display={{ xs: "hidden", sm: "flex" }}
            alignItems="center"
            gap="5px"
          >
            Page{" "}<strong> {current} of {pageCount}</strong>
          </Box>

          <CustomButton
            title="Next"
            color="#fcfcfc"
            backgroundColor="#475be8"
            disabled={!(current === pageCount)}
            handleClick={() => setCurrent((prev) => prev + 1)}
          />

          <Select
            variant="outlined"
            color="info"
            displayEmpty
            required
            inputProps={{ "arial-label": "Without label" }}
            defaultValue={10}
            onChange={(e) => setPageSize(e.target.value? Number(e.target.value): 10)}
            >
              {[10,20,30,40,50].map((size)=>(
                <MenuItem key={size} value={size}>Show {size}</MenuItem>
              ))}
          </Select>

        </Box>
      )}
    </Box>
  );
};

export default AllProperties;
