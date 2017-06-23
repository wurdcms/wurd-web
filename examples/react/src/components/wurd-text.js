import React from 'react';
import PropTypes from 'proptypes';
import marked from 'marked';
import wurd from '../wurd';


const WurdText = ({id, vars, markdown}) => {
  let text = wurd.get(id, vars);

  if (markdown && text) { //Check for text first to prevent markdown error
    return (
      <div 
        data-wurd-md={id} 
        dangerouslySetInnerHTML={{__html: marked(text) }} 
      />
    );
  } else {
    return <span data-wurd={id}>{text}</span>;
  }

};


WurdText.propTypes = {
  id: PropTypes.string.isRequired,
  vars: PropTypes.object,
  markdown: PropTypes.bool
};


export default WurdText;
