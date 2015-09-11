import React from 'react';
import renderChildren from './render-children';

/**
 * Render a Form component.
 * @returns {JSX}
 */
 class Form extends React.Component {
   render() {
     return <form>{renderChildren(this.props)}</form>;
   }
 }

 export default Form;
