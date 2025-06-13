import { useState, useEffect } from 'react';

/**
 * Custom hook to manage layer visibility and outlining state
 * @param {Array} layers - The layers from the pageBundle
 * @returns {Object} Layer state and methods to update it
 */
export const useLayerState = (layers) => {
  // State for layer visibility
  const [layerVisibility, setLayerVisibility] = useState({
    allLayers: true,
    // Individual layers will be managed dynamically
  });
  
  // State for object outlining
  const [outlineObjects, setOutlineObjects] = useState(false);
  
  // State for layer outlining - tracks which layers should have outlines
  const [layerOutlining, setLayerOutlining] = useState({
    allLayers: false, // Initially no layers are outlined
    // Individual layer outlining will be managed dynamically
  });
  
  // Initialize layer visibility and outlining states when layers change
  useEffect(() => {
    if (layers && layers.length > 0) {
      let needsVisibilityUpdate = false;
      let needsOutliningUpdate = false;
      const newVisibilityState = { ...layerVisibility };
      const newOutliningState = { ...layerOutlining };
      
      layers.forEach(layer => {
        const layerKey = `layer_${layer.z_index}`;
        
        // Initialize visibility state if not already set
        if (newVisibilityState[layerKey] === undefined) {
          newVisibilityState[layerKey] = layerVisibility.allLayers;
          needsVisibilityUpdate = true;
        }
        
        // Initialize outlining state if not already set
        if (newOutliningState[layerKey] === undefined) {
          newOutliningState[layerKey] = layerOutlining.allLayers;
          needsOutliningUpdate = true;
        }
      });
      
      // Only update state if there are changes
      if (needsVisibilityUpdate) {
        setLayerVisibility(newVisibilityState);
      }
      
      if (needsOutliningUpdate) {
        setLayerOutlining(newOutliningState);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers]); // Intentionally only depend on layers changes
  
  // Transform API layer data to component format
  const processedLayers = layers ? layers.map(layer => ({
    zIndex: layer.z_index,
    type: layer.type,
    objectCount: layer.object_count,
    url: layer.url,
    visible: layerVisibility[`layer_${layer.z_index}`] === undefined ? 
      layerVisibility.allLayers : layerVisibility[`layer_${layer.z_index}`],
    outlined: outlineObjects && (layerOutlining[`layer_${layer.z_index}`] === undefined ? 
      layerOutlining.allLayers : layerOutlining[`layer_${layer.z_index}`])
  })) : [];
  
  // Toggle visibility of all layers
  const toggleAllLayers = () => {
    const newAllLayersState = !layerVisibility.allLayers;
    const newVisibility = { ...layerVisibility, allLayers: newAllLayersState };
    
    // Update all individual layer visibilities to match the "all layers" state
    if (layers) {
      layers.forEach(layer => {
        newVisibility[`layer_${layer.z_index}`] = newAllLayersState;
      });
    }
    
    setLayerVisibility(newVisibility);
    
    // If hiding all layers, also turn off outlining for all layers
    if (!newAllLayersState && outlineObjects) {
      const newOutlining = { ...layerOutlining, allLayers: false };
      
      // Set all individual layer outlining states to false
      if (layers) {
        layers.forEach(layer => {
          newOutlining[`layer_${layer.z_index}`] = false;
        });
      }
      
      setLayerOutlining(newOutlining);
    }
  };
  
  // Toggle visibility of a specific layer
  const toggleLayerVisibility = (zIndex) => {
    const layerKey = `layer_${zIndex}`;
    const currentVisibility = layerVisibility[layerKey] === undefined ? 
      layerVisibility.allLayers : layerVisibility[layerKey];
    
    // Create new visibility state with the toggled value for this layer
    const newVisibility = { 
      ...layerVisibility, 
      [layerKey]: !currentVisibility 
    };
    
    // Make sure all layers have explicit visibility states
    if (layers) {
      layers.forEach(layer => {
        const otherLayerKey = `layer_${layer.z_index}`;
        if (otherLayerKey !== layerKey && newVisibility[otherLayerKey] === undefined) {
          newVisibility[otherLayerKey] = layerVisibility.allLayers;
        }
      });
      
      // Check if all layers are now visible
      const allVisible = layers.every(layer => {
        const layerKey = `layer_${layer.z_index}`;
        return newVisibility[layerKey] !== false;
      });
      newVisibility.allLayers = allVisible;
    }
    
    setLayerVisibility(newVisibility);
    
    // If we're hiding a layer, also turn off its outlining
    if (currentVisibility && layerOutlining[layerKey]) {
      const newOutlining = {
        ...layerOutlining,
        [layerKey]: false
      };
      
      // Make sure all other layers have explicit outlining states
      if (layers) {
        layers.forEach(layer => {
          const otherLayerKey = `layer_${layer.z_index}`;
          if (otherLayerKey !== layerKey && newOutlining[otherLayerKey] === undefined) {
            newOutlining[otherLayerKey] = layerOutlining.allLayers;
          }
        });
        
        // Update the allLayers state for outlining - only consider visible layers
        const allOutlined = layers.every(layer => {
          const layerKey = `layer_${layer.z_index}`;
          const layerIsVisible = newVisibility[layerKey] === undefined
            ? newVisibility.allLayers
            : newVisibility[layerKey];
          
          if (!layerIsVisible) {
            return true; // Skip invisible layers in the "all" check
          }
          
          const isOutlined = newOutlining[layerKey] === undefined 
            ? newOutlining.allLayers 
            : newOutlining[layerKey];
            
          return isOutlined;
        });
        
        newOutlining.allLayers = allOutlined;
      }
      
      setLayerOutlining(newOutlining);
    }
  };
  
  // Toggle object outlining
  const toggleOutlining = () => {
    const newOutlineState = !outlineObjects;
    setOutlineObjects(newOutlineState);
    
    // If turning on outlines, set all visible layers to be outlined
    if (newOutlineState) {
      const newLayerOutlining = { ...layerOutlining, allLayers: true };
      
      // Set all individual layer outlining states based on their visibility
      if (layers) {
        layers.forEach(layer => {
          const layerKey = `layer_${layer.z_index}`;
          const isVisible = layerVisibility[layerKey] === undefined 
            ? layerVisibility.allLayers 
            : layerVisibility[layerKey];
          
          // Only outline visible layers
          newLayerOutlining[layerKey] = isVisible;
        });
      }
      
      setLayerOutlining(newLayerOutlining);
    }
  };
  
  // Toggle outlining for a specific layer
  const toggleLayerOutlining = (zIndex) => {
    // First check if this layer is visible - can't outline invisible layers
    const layerKey = `layer_${zIndex}`;
    const isVisible = layerVisibility[layerKey] === undefined 
      ? layerVisibility.allLayers 
      : layerVisibility[layerKey];
    
    // Don't allow outlining invisible layers
    if (!isVisible) {
      return;
    }
    
    // If outlines are disabled globally, enable them first
    if (!outlineObjects) {
      setOutlineObjects(true);
    }
    
    // Toggle outlining for this specific layer
    const currentOutlining = layerOutlining[layerKey] === undefined 
      ? layerOutlining.allLayers 
      : layerOutlining[layerKey];
    
    // Create a new outlining state with the toggled value for this layer
    const newOutlining = { 
      ...layerOutlining, 
      [layerKey]: !currentOutlining 
    };
    
    // Make sure all other layers have explicit outlining states
    // This prevents issues when toggling visibility and outlining
    if (layers) {
      layers.forEach(layer => {
        const otherLayerKey = `layer_${layer.z_index}`;
        if (otherLayerKey !== layerKey && newOutlining[otherLayerKey] === undefined) {
          newOutlining[otherLayerKey] = layerOutlining.allLayers;
        }
      });
      
      // Check if all visible layers are now outlined or not
      const allOutlined = layers.every(layer => {
        const layerIsVisible = layerVisibility[`layer_${layer.z_index}`] === undefined
          ? layerVisibility.allLayers
          : layerVisibility[`layer_${layer.z_index}`];
        
        if (!layerIsVisible) {
          return true; // Skip invisible layers in the "all" check
        }
        
        const layerKey = `layer_${layer.z_index}`;
        const isOutlined = newOutlining[layerKey] === undefined 
          ? newOutlining.allLayers 
          : newOutlining[layerKey];
          
        return isOutlined;
      });
      
      newOutlining.allLayers = allOutlined;
    }
    
    setLayerOutlining(newOutlining);
  };
  
  return {
    layerVisibility,
    layerOutlining,
    outlineObjects,
    processedLayers,
    toggleAllLayers,
    toggleLayerVisibility,
    toggleOutlining,
    toggleLayerOutlining
  };
};

export default useLayerState;
