import "./App.css";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import { useState } from "react";
import axios from "axios";

import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const [lourl, setLourl] = useState("");
  const [shurl, setShurl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [rows, setRows] = useState([
    // createData(1, 'longurl1', 'shorturl1', 32),
  ]);

  console.log(shurl);
  console.log(submitting);

  const columns = [
    { id: "srno", label: "#", minWidth: 10 },

    {
      id: "longurl",
      label: "Long Url",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "shorturl",
      label: "Short Url",
      minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    { id: "count", label: "Count", minWidth: 10 },
  ];

  function createData(srno, longurl, shorturl, count) {
    return { srno, longurl, shorturl, count };
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function Submit(event) {
    event.preventDefault();
    setShurl(null);
    setSubmitting(true);
    if (lourl !== "") {
      axios
        .post("https://urlshortnerbackend.onrender.com/short", {
          full: { lourl },
        })
        .then((response) => {
          console.log(response.data);
          setShurl(response.data.short);
          let copy = [...rows];
          copy.push(
            createData(
              copy.length + 1,
              lourl,
              `https://urlshortnerbackend.onrender.com/${response.data.short}`,
              response.data.count
            )
          );
          setRows(copy);
        })

        .catch((error) => console.log(error));
    }

    setTimeout(() => {
      setSubmitting(false);
    }, 2000);
  }

  return (
    <div className="App">
      {/* navbar start */}
      <nav class="bg-gray-800">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div class="relative flex h-16 items-center justify-between">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              <span class="block text-indigo-600">Shorty...url</span>
            </h2>
          </div>
        </div>
      </nav>
      {/* navbar ends */}
      {/* long url form */}
      <form onSubmit={Submit} className="my-20 mx-4">
        <label
          for="search"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            id="lurl"
            name="lurl"
            class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Long Url"
            onChange={(event) => setLourl(event.target.value)}
            value={lourl}
            required
          ></input>
          <button
            type="submit"
            class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Shorten
          </button>
        </div>
      </form>
      {/* long url ends */}
      {/* spinner */}
      {shurl === null ?  <CircularProgress /> : null}

      {/* Url list */}
      <div class="m-4">
        <Paper sx={{ width: "100%" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ top: 0, minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      {/* Url list ends */}
    </div>
  );
}

export default App;
