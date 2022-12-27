import nano from 'nano';
import React from 'react';

const MetaInfo: React.FC<{ meta: nano.InfoResponse }> = ({ meta }) => (
    <table>
        <tbody>
            <tr>
                <td>couchdb:</td>
                <td>{ meta.couchdb }</td>
            </tr>
            <tr>
                <td>version:</td>
                <td>{ meta.version }</td>
            </tr>
            <tr>
                <td>git_sha:</td>
                <td>{ meta.git_sha }</td>
            </tr>
            <tr>
                <td>uuid:</td>
                <td>{ meta.uuid }</td>
            </tr>
            <tr>
                <td>vendor:</td>
                <td>{ meta.vendor.name }</td>
            </tr>
        </tbody>
    </table>
);

export default MetaInfo;