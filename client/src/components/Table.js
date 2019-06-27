import React from 'react';

import './Table.css';

const Table = (props) => {
    // Data
    const dataColumns = props.data.columns;
    const dataRows = props.data.rows;

    const tableHeaders = (<thead>
          <tr>
            {dataColumns.map(function(column) {
              return <th>{column}</th>; })}
          </tr>
      </thead>);

    const tableBody = 
        dataRows.map((row, index) => {
            return (
                <tr>
                    {dataColumns.map(column => <td>{row[column]}</td>)}
                </tr>
            ); 
        });
     
    // Decorate with Bootstrap CSS
    return (
          <table className="subscriptions-table">
              {tableHeaders}
              <tbody>
                {tableBody}
              </tbody>
          </table>
      );
};

export default Table;