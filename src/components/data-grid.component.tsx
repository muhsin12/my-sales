import { Box, TableCell, Table, TableBody, TableRow } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GridEventListener } from "@mui/x-data-grid";

interface Props {
  pageState: any; // Define proper types for pageState and other props
  handleRowClick: GridEventListener<"rowClick">;
  totalAmount: number;
  columns: GridColDef[];
  generateRandom: () => string;
  setPageState: React.Dispatch<
    React.SetStateAction<{
      isLoading: boolean;
      data: never[];
      totalCount: number;
      page: number;
      pageSize: number;
    }>
  >;
}

const DataGridComponent: React.FC<Props> = ({
  pageState,
  handleRowClick,
  totalAmount,
  columns,
  generateRandom,
  setPageState,
}) => {
  const handlePageChange = (newPage: number) => {
    setPageState((old) => ({ ...old, page: newPage + 1 }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageState((old) => ({ ...old, pageSize: newPageSize }));
  };
  return (
    <>
      <Box sx={{ bgcolor: "white", height: "80vh" }}>
        <DataGrid
          onRowClick={handleRowClick}
          pagination
          rows={pageState.data}
          rowCount={pageState.totalCount}
          loading={pageState.isLoading}
          page={pageState.page - 1}
          pageSize={pageState.pageSize}
          onPageChange={handlePageChange} // Use handlePageChange function
          onPageSizeChange={handlePageSizeChange}
          rowsPerPageOptions={[5, 10, 15, 20]}
          paginationMode="server"
          columns={columns}
          getRowId={(row: any) => generateRandom()}
          disableSelectionOnClick
        />
      </Box>
      {totalAmount !== 0 && (
        <Box sx={{ bgcolor: "white", height: "30vh" }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="tdWidth">Total</TableCell>
                <TableCell className="tdWidth">{totalAmount}</TableCell>
                <TableCell className="tdWidth"></TableCell>
                <TableCell className="tdWidth"></TableCell>
                <TableCell className="tdWidth"></TableCell>
                <TableCell className="tdWidth"></TableCell>
                <TableCell className="tdWidth"></TableCell>
                <TableCell className="tdWidth"></TableCell>
                <TableCell className="tdWidth"></TableCell>
                <TableCell className="tdWidth"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      )}
    </>
  );
};

export default DataGridComponent;
