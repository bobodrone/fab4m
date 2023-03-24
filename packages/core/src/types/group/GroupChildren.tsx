import * as React from "react";
import { componentErrors, FormDataContext } from "../../form";
import FormComponentView from "../../components/FormComponentView";
import { WidgetProps } from "../../widget";
/**
 * Helper react component to render children of a component.
 * @group React Widget API
 */
export default function GroupChildren(
  props: WidgetProps<unknown, unknown> & {
    wrapperClass?: string;
  }
): JSX.Element | null {
  if (!props.component.components) {
    return null;
  }
  const value = props.value as Record<string, unknown> | undefined;
  const changeChildValue = (name: string, newValue: unknown) => {
    props.onChange({
      ...value,
      [name]: newValue,
    });
  };
  const children = props.component.components.map((component, index) => {
    if (Array.isArray(component) || !component.name) {
      return null;
    }
    const renderedComponent = (
      <FormComponentView
        key={index}
        value={
          value && value[component.name] ? value[component.name] : undefined
        }
        name={`${props.name}[${component.name}]`}
        id={`${props.id}_${component.name}`}
        component={component}
        errors={
          props.errors && componentErrors(`/${component.name}`, props.errors)
        }
        onChange={(value) =>
          component.name && changeChildValue(component.name, value)
        }
        theme={props.theme}
      />
    );
    return props.wrapperClass ? (
      <div key={index} className={props.wrapperClass}>
        {renderedComponent}
      </div>
    ) : (
      renderedComponent
    );
  });
  return (
    <FormDataContext.Provider value={value ?? {}}>
      {children}
    </FormDataContext.Provider>
  );
}
