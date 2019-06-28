import React from 'react';
import './Table.css';

const Table = (props) => {
    // Data
    const dataColumns = props.data.columns;
    const dataRows = props.data.rows;

    const tableHeaders = (<thead>
          <tr>
            {dataColumns.map((column, index) => {
              return <th key={'indx' + index}>{column}</th>; })}
          </tr>
      </thead>);

    const tableBody = 
        dataRows.map((row, index) => {
            return (
                <tr key={'myKey' + index}>
                    {dataColumns.map((column, idx) => <td key={'index' + idx}>{row[column]}</td>)}
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